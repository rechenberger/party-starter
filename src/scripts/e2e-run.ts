import 'dotenv-flow/config'

import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import path from 'node:path'
import {
  extractConnectionString,
  getWorkerCount,
  spawnAndWait,
} from './e2e-shared'

type Mode = 'ci' | 'dev'

type CliOptions = {
  mode: Mode
  playwrightArgs: string[]
}

const HELP_TEXT = `E2E runner

Usage:
  pnpm e2e:ci
  pnpm e2e:dev -- [playwright args]

Direct:
  tsx src/scripts/e2e-run.ts --mode <ci|dev> [-- <playwright args>]
`

const DEFAULT_PARENT_BRANCH = 'production'
const DEFAULT_BASE_URL = 'http://127.0.0.1:3000'
const DEFAULT_BRANCH_TTL_HOURS = 24
const DEFAULT_EMAIL_FROM = 'e2e@example.com'
const DEFAULT_SMTP_URL = 'smtp://e2e:e2e@127.0.0.1:2525'

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    mode: 'ci',
    playwrightArgs: [],
  }

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]

    if (token === '--help' || token === '-h') {
      console.log(HELP_TEXT)
      process.exit(0)
    }

    if (token === '--') {
      options.playwrightArgs.push(...argv.slice(i + 1))
      break
    }

    if (token === '--mode') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error('Missing value for --mode')
      }
      if (value !== 'ci' && value !== 'dev') {
        throw new Error(`Unknown mode "${value}"`)
      }
      options.mode = value
      i += 1
      continue
    }

    if (token.startsWith('--mode=')) {
      const value = token.slice('--mode='.length)
      if (value !== 'ci' && value !== 'dev') {
        throw new Error(`Unknown mode "${value}"`)
      }
      options.mode = value
      continue
    }

    options.playwrightArgs.push(token)
  }

  return options
}

function createRunId() {
  const now = new Date()
  const yyyy = now.getUTCFullYear()
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(now.getUTCDate()).padStart(2, '0')
  const hh = String(now.getUTCHours()).padStart(2, '0')
  const min = String(now.getUTCMinutes()).padStart(2, '0')
  const sec = String(now.getUTCSeconds()).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2, 8)
  return `${yyyy}${mm}${dd}-${hh}${min}${sec}-${rand}`
}

function sanitizeRunId(runId: string) {
  return runId.toLowerCase().replace(/[^a-z0-9-]+/g, '-')
}

function waitForExit(child: ChildProcess) {
  return new Promise<void>((resolve) => {
    child.once('exit', () => resolve())
  })
}

async function stopProcess(child: ChildProcess | null | undefined) {
  if (!child || child.exitCode !== null || child.killed) {
    return
  }

  child.kill('SIGTERM')

  const timeout = setTimeout(() => {
    if (child.exitCode === null && !child.killed) {
      child.kill('SIGKILL')
    }
  }, 8_000)

  await waitForExit(child)
  clearTimeout(timeout)
}

function neonArgs(baseArgs: string[], projectId: string) {
  return [...baseArgs, '--project-id', projectId]
}

function runNeon(
  baseArgs: string[],
  env: NodeJS.ProcessEnv,
  captureOutput = false,
) {
  const result = spawnSync('pnpm', ['exec', 'neonctl', ...baseArgs], {
    env,
    encoding: 'utf8',
    stdio: captureOutput ? 'pipe' : 'inherit',
  })

  if (result.error) {
    throw result.error
  }

  return result
}

function requireSuccess(result: ReturnType<typeof runNeon>, message: string) {
  if (result.status === 0) {
    return
  }
  const details = [result.stderr, result.stdout]
    .filter(Boolean)
    .join('\n')
    .trim()
  throw new Error(details ? `${message}\n${details}` : message)
}

function getConnectionString({
  branch,
  projectId,
  env,
}: {
  branch: string
  projectId: string
  env: NodeJS.ProcessEnv
}) {
  const args = neonArgs(
    ['connection-string', branch, '--pooled', '-o', 'json'],
    projectId,
  )

  const result = runNeon(args, env, true)
  requireSuccess(
    result,
    `Failed to get connection string for branch "${branch}"`,
  )

  return extractConnectionString(result.stdout || '', result.stderr || '')
}

async function waitForServer(baseUrl: string) {
  const statusUrl = new URL('/api/auth/session', baseUrl).toString()
  const deadline = Date.now() + 120_000

  while (Date.now() < deadline) {
    try {
      const response = await fetch(statusUrl, {
        method: 'GET',
        cache: 'no-store',
      })
      if (response.status >= 200 && response.status < 400) {
        return
      }
    } catch {
      // retry
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  throw new Error(`Server did not become ready within timeout: ${statusUrl}`)
}

function createCiEnv({
  runId,
  artifactsDir,
  manifestPath,
  databaseUrl,
  workerCount,
}: {
  runId: string
  artifactsDir: string
  manifestPath: string
  databaseUrl: string
  workerCount: number
}) {
  const baseUrl = process.env.BASE_URL ?? DEFAULT_BASE_URL
  return withAuthMailDefaults({
    ...process.env,
    DATABASE_URL: databaseUrl,
    BASE_URL: baseUrl,
    AUTH_URL: process.env.AUTH_URL ?? baseUrl,
    E2E_MODE: 'ci',
    E2E_RUN_ID: runId,
    E2E_WORKERS: String(workerCount),
    E2E_ARTIFACTS_DIR: artifactsDir,
    E2E_SEED_MANIFEST: manifestPath,
  })
}

function createDevEnv() {
  const runId = sanitizeRunId(process.env.E2E_RUN_ID ?? 'dev')
  const workerCount = getWorkerCount()
  const artifactsDir = path.resolve(process.cwd(), '.e2e-artifacts', runId)
  const manifestPath =
    process.env.E2E_SEED_MANIFEST ??
    path.join(artifactsDir, 'seed-manifest.json')

  const baseUrl = process.env.BASE_URL ?? DEFAULT_BASE_URL
  return withAuthMailDefaults({
    ...process.env,
    BASE_URL: baseUrl,
    AUTH_URL: process.env.AUTH_URL ?? baseUrl,
    E2E_MODE: 'dev',
    E2E_RUN_ID: runId,
    E2E_WORKERS: String(workerCount),
    E2E_ARTIFACTS_DIR: artifactsDir,
    E2E_SEED_MANIFEST: manifestPath,
  })
}

function withAuthMailDefaults(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return {
    ...env,
    ACTUALLY_SEND_EMAILS: 'false',
    EMAIL_FROM: env.EMAIL_FROM?.trim() || DEFAULT_EMAIL_FROM,
    SMTP_URL: env.SMTP_URL?.trim() || DEFAULT_SMTP_URL,
  }
}

async function runCi(playwrightArgs: string[]) {
  const projectId = process.env.NEON_PROJECT_ID?.trim()
  if (!projectId) {
    throw new Error('NEON_PROJECT_ID is required for ci mode')
  }

  if (!process.env.NEON_API_KEY?.trim()) {
    throw new Error('NEON_API_KEY is required for ci mode')
  }

  const parentBranch =
    process.env.E2E_NEON_PARENT_BRANCH?.trim() || DEFAULT_PARENT_BRANCH

  const runId = sanitizeRunId(createRunId())
  const branch = `e2e/${runId}`
  const expiresAt = new Date(
    Date.now() + DEFAULT_BRANCH_TTL_HOURS * 60 * 60 * 1000,
  ).toISOString()

  const artifactsDir = path.resolve(process.cwd(), '.e2e-artifacts', runId)
  const manifestPath = path.join(artifactsDir, 'seed-manifest.json')

  const baseEnv = {
    ...process.env,
  }

  let serverProcess: ChildProcess | null = null
  let branchCreated = false

  try {
    const createArgs = neonArgs(
      [
        'branches',
        'create',
        '--name',
        branch,
        '--parent',
        parentBranch,
        '--schema-only',
        '--expires-at',
        expiresAt,
      ],
      projectId,
    )

    requireSuccess(
      runNeon(createArgs, baseEnv),
      `Failed to create Neon branch "${branch}"`,
    )

    branchCreated = true

    const databaseUrl = getConnectionString({
      branch,
      projectId,
      env: baseEnv,
    })

    const workerCount = getWorkerCount()
    const ciEnv = createCiEnv({
      runId,
      artifactsDir,
      manifestPath,
      databaseUrl,
      workerCount,
    })

    await spawnAndWait('pnpm', ['db:push'], ciEnv)
    await spawnAndWait('pnpm', ['e2e:seed'], ciEnv)
    await spawnAndWait('pnpm', ['e2e:build'], ciEnv)

    serverProcess = spawn('pnpm', ['e2e:start'], {
      env: ciEnv,
      stdio: 'inherit',
    })

    await waitForServer(ciEnv.BASE_URL ?? DEFAULT_BASE_URL)

    await spawnAndWait(
      'pnpm',
      [
        'exec',
        'playwright',
        'test',
        '-c',
        'playwright.ci.config.ts',
        ...playwrightArgs,
      ],
      ciEnv,
    )
  } finally {
    await stopProcess(serverProcess)

    if (branchCreated) {
      const deleteArgs = neonArgs(['branches', 'delete', branch], projectId)
      const deleteResult = runNeon(deleteArgs, baseEnv)

      if (deleteResult.status !== 0) {
        const fallbackExpiration = new Date(
          Date.now() + 2 * 60 * 60 * 1000,
        ).toISOString()

        console.warn(
          `Failed to delete branch "${branch}", setting fallback expiration to ${fallbackExpiration}`,
        )

        const setExpirationArgs = neonArgs(
          [
            'branches',
            'set-expiration',
            branch,
            '--expires-at',
            fallbackExpiration,
          ],
          projectId,
        )
        runNeon(setExpirationArgs, baseEnv)
      }
    }
  }
}

async function runDev(playwrightArgs: string[]) {
  const devEnv = createDevEnv()

  await spawnAndWait(
    'pnpm',
    [
      'exec',
      'playwright',
      'test',
      '-c',
      'playwright.dev.config.ts',
      ...playwrightArgs,
    ],
    devEnv,
  )
}

async function main() {
  const { mode, playwrightArgs } = parseArgs(process.argv.slice(2))

  if (mode === 'ci') {
    await runCi(playwrightArgs)
    return
  }

  await runDev(playwrightArgs)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

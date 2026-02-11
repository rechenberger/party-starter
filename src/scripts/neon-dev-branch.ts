import 'dotenv-flow/config'

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

type Command = 'create' | 'reset' | 'sync' | 'url' | 'env' | 'delete'

type CliOptions = {
  branch?: string
  username?: string
  parent: string
  projectId?: string
  databaseName?: string
  roleName?: string
  pooled: boolean
  schemaOnly: boolean
  setEnv: boolean
  printUrl: boolean
}

const DEFAULT_BRANCH = 'production'

const HELP_TEXT = `Neon dev branch helper

Usage:
  pnpm neon:dev:use
  pnpm neon:dev:create
  pnpm neon:dev:reset
  pnpm neon:dev:delete
  pnpm neon:dev:url
  pnpm neon:dev:env

Direct:
  tsx src/scripts/neon-dev-branch.ts <command> [options]

Commands:
  sync    Create branch if missing, otherwise reset it to parent (default)
  create  Create branch from parent
  reset   Reset existing branch to parent
  delete  Delete branch if it exists
  url     Print connection string for branch
  env     Update DATABASE_URL in .env.local for the target branch

Options:
  --username <name>       Username used for default branch name (dev/<username>)
  --branch <name>         Explicit branch name (overrides --username)
  --parent <branch>       Parent branch (default: ${DEFAULT_BRANCH})
  --project-id <id>       Neon project id (defaults to NEON_PROJECT_ID from dotenv-flow)
  --database-name <name>  Optional database name for connection string
  --role-name <name>      Optional role name for connection string
  --schema-only           Use schema-only branch creation (create/sync only)
  --no-pooled             Get direct connection string (default: pooled)
  --no-set-env            Do not write DATABASE_URL to .env.local
  --print-url             Print connection string to stdout
  --help                  Show this help
`

function parseArgs(argv: string[]) {
  let command: Command = 'sync'
  let optionTokens = argv

  if (argv[0] && !argv[0].startsWith('-')) {
    if (!['create', 'reset', 'sync', 'url', 'env', 'delete'].includes(argv[0])) {
      throw new Error(`Unknown command "${argv[0]}"`)
    }
    command = argv[0] as Command
    optionTokens = argv.slice(1)
  }

  const options: CliOptions = {
    parent: process.env.NEON_PARENT_BRANCH ?? DEFAULT_BRANCH,
    projectId: process.env.NEON_PROJECT_ID,
    databaseName: process.env.NEON_DATABASE_NAME,
    roleName: process.env.NEON_ROLE_NAME,
    pooled: true,
    schemaOnly: false,
    setEnv:
      command === 'create' ||
      command === 'reset' ||
      command === 'sync' ||
      command === 'env',
    printUrl: command === 'url',
  }

  for (let i = 0; i < optionTokens.length; i++) {
    const token = optionTokens[i]
    if (!token.startsWith('--')) continue

    const [rawKey, inlineValue] = token.slice(2).split('=', 2)
    const key = rawKey.trim()
    const next = inlineValue ?? optionTokens[i + 1]
    const hasNextValue = inlineValue !== undefined || (next && !next.startsWith('--'))

    const readValue = () => {
      if (!hasNextValue) throw new Error(`Missing value for --${key}`)
      if (inlineValue === undefined) i += 1
      return next
    }

    if (key === 'help') {
      console.log(HELP_TEXT)
      process.exit(0)
    }
    if (key === 'schema-only') {
      options.schemaOnly = true
      continue
    }
    if (key === 'pooled') {
      options.pooled = true
      continue
    }
    if (key === 'no-pooled') {
      options.pooled = false
      continue
    }
    if (key === 'set-env') {
      options.setEnv = true
      continue
    }
    if (key === 'no-set-env') {
      options.setEnv = false
      continue
    }
    if (key === 'print-url') {
      options.printUrl = true
      continue
    }
    if (key === 'username') {
      options.username = readValue()
      continue
    }
    if (key === 'branch') {
      options.branch = readValue()
      continue
    }
    if (key === 'parent') {
      options.parent = readValue()
      continue
    }
    if (key === 'project-id') {
      options.projectId = readValue()
      continue
    }
    if (key === 'database-name') {
      options.databaseName = readValue()
      continue
    }
    if (key === 'role-name') {
      options.roleName = readValue()
      continue
    }

    throw new Error(`Unknown option --${key}`)
  }

  return { command, options }
}

function normalizeUsername(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function resolveBranchName(options: CliOptions) {
  if (options.branch) return options.branch
  const rawUser =
    options.username ??
    process.env.NEON_DEV_USERNAME ??
    process.env.USER ??
    process.env.LOGNAME ??
    os.userInfo().username
  const normalized = normalizeUsername(rawUser || 'dev')
  return `dev/${normalized || 'dev'}`
}

function neonArgs(baseArgs: string[], options: CliOptions) {
  const args = [...baseArgs]
  if (options.projectId) {
    args.push('--project-id', options.projectId)
  }
  return args
}

function runNeon(baseArgs: string[], options: CliOptions, captureOutput = false) {
  const args = neonArgs(baseArgs, options)
  const result = spawnSync('pnpm', ['exec', 'neonctl', ...args], {
    encoding: 'utf8',
    stdio: captureOutput ? 'pipe' : 'inherit',
  })

  if (result.error) {
    throw result.error
  }

  return result
}

function branchExists(branch: string, options: CliOptions) {
  const result = runNeon(['branches', 'get', branch, '-o', 'json'], options, true)
  return result.status === 0
}

function requireSuccess(result: ReturnType<typeof runNeon>, message: string) {
  if (result.status === 0) return
  const details = [result.stderr, result.stdout].filter(Boolean).join('\n').trim()
  throw new Error(details ? `${message}\n${details}` : message)
}

function createBranch(branch: string, options: CliOptions) {
  const args = ['branches', 'create', '--name', branch, '--parent', options.parent]
  if (options.schemaOnly) args.push('--schema-only')
  requireSuccess(runNeon(args, options), `Failed to create branch "${branch}"`)
}

function resetBranch(branch: string, options: CliOptions) {
  requireSuccess(
    runNeon(['branches', 'reset', branch, '--parent'], options),
    `Failed to reset branch "${branch}"`,
  )
}

function deleteBranch(branch: string, options: CliOptions) {
  if (!branchExists(branch, options)) {
    return false
  }

  requireSuccess(
    runNeon(['branches', 'delete', branch], options),
    `Failed to delete branch "${branch}"`,
  )

  return true
}

function findConnectionString(input: unknown): string | undefined {
  if (typeof input === 'string' && /^postgres(ql)?:\/\//i.test(input)) {
    return input
  }
  if (Array.isArray(input)) {
    for (const value of input) {
      const match = findConnectionString(value)
      if (match) return match
    }
    return undefined
  }
  if (!input || typeof input !== 'object') return undefined

  const record = input as Record<string, unknown>
  const preferredKeys = ['connectionString', 'connection_string', 'uri', 'url']
  for (const key of preferredKeys) {
    const value = record[key]
    const match = findConnectionString(value)
    if (match) return match
  }
  for (const value of Object.values(record)) {
    const match = findConnectionString(value)
    if (match) return match
  }
  return undefined
}

function getConnectionString(branch: string, options: CliOptions) {
  const args = ['connection-string', branch, '-o', 'json']
  if (options.pooled) args.push('--pooled')
  if (options.databaseName) args.push('--database-name', options.databaseName)
  if (options.roleName) args.push('--role-name', options.roleName)

  const result = runNeon(args, options, true)
  requireSuccess(result, `Failed to fetch connection string for "${branch}"`)

  const output = [result.stdout, result.stderr].filter(Boolean).join('\n')

  try {
    const parsed = JSON.parse(result.stdout || '{}')
    const fromJson = findConnectionString(parsed)
    if (fromJson) return fromJson
  } catch {
    // Fall back to regex extraction for non-json output.
  }

  const regexMatch = output.match(/postgres(?:ql)?:\/\/[^\s"'`]+/i)
  if (regexMatch) return regexMatch[0]

  throw new Error('Could not parse connection string from neonctl output')
}

function upsertEnvDatabaseUrl(connectionString: string) {
  const envPath = path.resolve(process.cwd(), '.env.local')
  const escaped = connectionString.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const nextLine = `DATABASE_URL="${escaped}"`
  const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''

  if (/^DATABASE_URL=.*$/m.test(content)) {
    const updated = content.replace(/^DATABASE_URL=.*$/m, nextLine)
    fs.writeFileSync(envPath, updated, 'utf8')
    return envPath
  }

  const separator = content.length > 0 && !content.endsWith('\n') ? '\n' : ''
  fs.writeFileSync(envPath, `${content}${separator}${nextLine}\n`, 'utf8')
  return envPath
}

function main() {
  const argv = process.argv.slice(2)
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(HELP_TEXT)
    return
  }

  const { command, options } = parseArgs(argv)
  const projectId = options.projectId?.trim()
  if (!projectId) {
    throw new Error(
      'NEON_PROJECT_ID is not set. Add it to .env.local or pass --project-id <id>.',
    )
  }
  options.projectId = projectId

  const branch = resolveBranchName(options)

  if (command === 'delete') {
    const deleted = deleteBranch(branch, options)
    if (deleted) {
      console.log(`Deleted branch: ${branch}`)
    } else {
      console.log(`Branch does not exist, skipping delete: ${branch}`)
    }
    return
  }

  if (command === 'create') {
    createBranch(branch, options)
  } else if (command === 'reset') {
    resetBranch(branch, options)
  } else if (command === 'sync') {
    if (branchExists(branch, options)) {
      resetBranch(branch, options)
    } else {
      createBranch(branch, options)
    }
  }

  const connectionString = getConnectionString(branch, options)

  if (options.setEnv) {
    const envPath = upsertEnvDatabaseUrl(connectionString)
    console.log(`Branch: ${branch}`)
    console.log(`DATABASE_URL updated in ${envPath}`)
  }

  if (options.printUrl) {
    console.log(connectionString)
  }
}

main()

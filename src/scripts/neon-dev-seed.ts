import 'dotenv-flow/config'

import { spawnSync } from 'node:child_process'
import { extractConnectionString, spawnAndWait } from './e2e-shared'

const HELP_TEXT = `Neon dev seed helper

Usage:
  pnpm neon:dev:seed
  pnpm neon:dev:seed -- --username <name>
  pnpm neon:dev:seed -- --branch <name>

This command runs:
  1) delete target branch (if it exists)
  2) create target branch with --schema-only and update DATABASE_URL
  3) pnpm db:push
  4) pnpm e2e:seed

All CLI options are forwarded to neon-dev-branch.ts.
`

function resolveConnectionString(args: string[]) {
  const result = spawnSync(
    'pnpm',
    ['exec', 'tsx', 'src/scripts/neon-dev-branch.ts', 'url', ...args],
    {
      encoding: 'utf8',
      env: process.env,
      stdio: 'pipe',
    },
  )

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    const details = [result.stderr, result.stdout]
      .filter(Boolean)
      .join('\n')
      .trim()
    throw new Error(
      details || 'Failed to resolve Neon branch connection string',
    )
  }

  return extractConnectionString(result.stdout || '', result.stderr || '')
}

async function main() {
  const args = process.argv.slice(2)
  const forwardedArgs = args.filter((token) => token !== '--')

  if (args.includes('--help') || args.includes('-h')) {
    console.log(HELP_TEXT)
    return
  }

  await spawnAndWait('pnpm', [
    'exec',
    'tsx',
    'src/scripts/neon-dev-branch.ts',
    'delete',
    ...forwardedArgs,
  ])

  await spawnAndWait('pnpm', [
    'exec',
    'tsx',
    'src/scripts/neon-dev-branch.ts',
    'create',
    '--schema-only',
    ...forwardedArgs,
  ])

  const databaseUrl = resolveConnectionString(forwardedArgs)
  const nextEnv = {
    ...process.env,
    DATABASE_URL: databaseUrl,
  }

  await spawnAndWait('pnpm', ['db:push'], nextEnv)
  await spawnAndWait('pnpm', ['e2e:seed'], nextEnv)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

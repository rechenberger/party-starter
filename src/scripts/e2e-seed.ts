import 'dotenv-flow/config'

import { createServerConvexClient } from '@/lib/convex-server'
import fs from 'node:fs/promises'
import path from 'node:path'
import { getWorkerCount } from './e2e-shared'

type SeedUserName =
  | 'owner'
  | 'adminAlt'
  | 'member'
  | 'memberReadonly'
  | 'candidate'
  | 'mailUser'
  | 'victim'
  | 'passwordReset'
  | 'deleteTarget'

type SeedUser = {
  id: string
  email: string
  password: string
}

type SeedPartition = {
  index: number
  orgs: {
    members: string
    invites: string
    membersReadonly: string
    joinEdge: string
  }
  inviteCodes: {
    joinEdge: {
      valid: string
      expired: string
      maxed: string
    }
  }
  users: Record<SeedUserName, SeedUser>
}

type SeedManifest = {
  runId: string
  createdAt: string
  workers: number
  partitions: SeedPartition[]
}

function sanitize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
}

async function writeManifest(manifest: SeedManifest) {
  const defaultPath = path.resolve(
    process.cwd(),
    '.e2e-artifacts',
    manifest.runId,
    'seed-manifest.json',
  )
  const manifestPath = process.env.E2E_SEED_MANIFEST
    ? path.resolve(process.cwd(), process.env.E2E_SEED_MANIFEST)
    : defaultPath

  await fs.mkdir(path.dirname(manifestPath), { recursive: true })
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')

  console.log(`Seed manifest written to ${manifestPath}`)
}

async function main() {
  const runId = sanitize(process.env.E2E_RUN_ID ?? 'dev')
  const workers = getWorkerCount()
  const convex = createServerConvexClient()

  const manifest = (await convex.action('seed:run' as any, {
    runId,
    workers,
  })) as SeedManifest

  await writeManifest(manifest)
  console.log(`Seeded ${workers} e2e partition(s)`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

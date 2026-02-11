import type { TestInfo } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

export type SeedUser = {
  id: string
  email: string
  password: string
}

export type SeedPartition = {
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
  users: {
    owner: SeedUser
    adminAlt: SeedUser
    member: SeedUser
    memberReadonly: SeedUser
    candidate: SeedUser
    mailUser: SeedUser
    victim: SeedUser
    passwordReset: SeedUser
    deleteTarget: SeedUser
  }
}

export type SeedManifest = {
  runId: string
  createdAt: string
  workers: number
  partitions: SeedPartition[]
}

const defaultManifestPath = path.resolve(
  process.cwd(),
  '.e2e-artifacts',
  process.env.E2E_RUN_ID ?? 'dev',
  'seed-manifest.json',
)

export const getManifestPath = () => {
  return process.env.E2E_SEED_MANIFEST
    ? path.resolve(process.cwd(), process.env.E2E_SEED_MANIFEST)
    : defaultManifestPath
}

let cachedManifest: SeedManifest | undefined

export const loadSeedManifest = () => {
  if (cachedManifest) {
    return cachedManifest
  }

  const manifestPath = getManifestPath()
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `Seed manifest not found: ${manifestPath}. Run \`pnpm e2e:seed\` before executing tests.`,
    )
  }

  const raw = fs.readFileSync(manifestPath, 'utf8')
  cachedManifest = JSON.parse(raw) as SeedManifest

  if (!cachedManifest.partitions.length) {
    throw new Error(`Seed manifest has no partitions: ${manifestPath}`)
  }

  return cachedManifest
}

export const getPartitionForWorker = (testInfo: TestInfo) => {
  const manifest = loadSeedManifest()
  return manifest.partitions[testInfo.workerIndex % manifest.partitions.length]
}

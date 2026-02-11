import 'dotenv-flow/config'

import { hashPassword } from '@/auth/password'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { and, asc, eq, inArray } from 'drizzle-orm'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

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

const DEFAULT_MAX_WORKERS = 6

function sanitize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
}

function getWorkerCount() {
  const fromEnv = Number(process.env.E2E_WORKERS)
  if (Number.isInteger(fromEnv) && fromEnv > 0) {
    return fromEnv
  }
  return Math.max(1, Math.min(os.cpus().length, DEFAULT_MAX_WORKERS))
}

async function upsertUser({
  id,
  email,
  password,
  name,
  isAdmin,
}: {
  id: string
  email: string
  password: string
  name: string
  isAdmin: boolean
}) {
  const passwordHash = await hashPassword({ password })

  const existingUsers = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .orderBy(asc(schema.users.createdAt))

  const primaryExisting = existingUsers[0]

  if (existingUsers.length > 1) {
    const duplicateIds = existingUsers.slice(1).map((entry) => entry.id)
    await db.delete(schema.users).where(inArray(schema.users.id, duplicateIds))
  }

  if (primaryExisting) {
    const resolvedId = primaryExisting.id

    await db
      .update(schema.users)
      .set({
        name,
        isAdmin,
        emailVerified: new Date(),
        passwordHash,
      })
      .where(eq(schema.users.id, resolvedId))

    return { id: resolvedId, email, password }
  }

  await db.insert(schema.users).values({
    id,
    email,
    name,
    isAdmin,
    emailVerified: new Date(),
    passwordHash,
  })

  return { id, email, password }
}

async function upsertOrg({ slug, name }: { slug: string; name: string }) {
  const [org] = await db
    .insert(schema.organizations)
    .values({
      slug,
      name,
    })
    .onConflictDoUpdate({
      target: [schema.organizations.slug],
      set: {
        name,
      },
    })
    .returning({
      id: schema.organizations.id,
      slug: schema.organizations.slug,
    })

  if (!org) {
    throw new Error(`Failed to upsert organization ${slug}`)
  }

  return org
}

async function upsertMembership({
  userId,
  organizationId,
  role,
}: {
  userId: string
  organizationId: string
  role: 'admin' | 'member'
}) {
  await db
    .delete(schema.organizationMemberships)
    .where(
      and(
        eq(schema.organizationMemberships.userId, userId),
        eq(schema.organizationMemberships.organizationId, organizationId),
      ),
    )

  await db.insert(schema.organizationMemberships).values({
    userId,
    organizationId,
    role,
  })
}

async function syncOrgMemberships({
  organizationId,
  admins,
  members,
  allSeededUserIds,
}: {
  organizationId: string
  admins: string[]
  members: string[]
  allSeededUserIds: string[]
}) {
  const keepUserIds = [...admins, ...members]

  const removeUserIds = allSeededUserIds.filter(
    (userId) => !keepUserIds.includes(userId),
  )

  if (removeUserIds.length > 0) {
    await db
      .delete(schema.organizationMemberships)
      .where(
        and(
          eq(schema.organizationMemberships.organizationId, organizationId),
          inArray(schema.organizationMemberships.userId, removeUserIds),
        ),
      )
  }

  for (const userId of admins) {
    await upsertMembership({
      userId,
      organizationId,
      role: 'admin',
    })
  }

  for (const userId of members) {
    await upsertMembership({
      userId,
      organizationId,
      role: 'member',
    })
  }
}

async function upsertInviteCode({
  id,
  organizationId,
  role,
  createdById,
  updatedById,
  expiresAt,
  usesMax,
  usesCurrent,
  sentToEmail,
}: {
  id: string
  organizationId: string
  role: 'admin' | 'member'
  createdById: string
  updatedById: string
  expiresAt?: Date | null
  usesMax?: number | null
  usesCurrent?: number | null
  sentToEmail?: string | null
}) {
  await db
    .insert(schema.inviteCodes)
    .values({
      id,
      organizationId,
      role,
      createdById,
      updatedById,
      expiresAt: expiresAt ?? null,
      usesMax: usesMax ?? null,
      usesCurrent: usesCurrent ?? null,
      sentToEmail: sentToEmail ?? null,
      deletedAt: null,
      comment: 'E2E seeded',
    })
    .onConflictDoUpdate({
      target: [schema.inviteCodes.id],
      set: {
        organizationId,
        role,
        createdById,
        updatedById,
        expiresAt: expiresAt ?? null,
        usesMax: usesMax ?? null,
        usesCurrent: usesCurrent ?? null,
        sentToEmail: sentToEmail ?? null,
        deletedAt: null,
        comment: 'E2E seeded',
      },
    })
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
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set for e2e seed')
  }

  const runId = sanitize(process.env.E2E_RUN_ID ?? 'dev')
  const workers = getWorkerCount()

  const partitions: SeedPartition[] = []

  for (let index = 0; index < workers; index += 1) {
    const prefix = `e2e-${runId}-${index}`

    const users = {
      owner: await upsertUser({
        id: `${prefix}-owner`,
        email: `${prefix}.owner@example.com`,
        password: `OwnerPass!${index}`,
        name: `E2E Owner ${index}`,
        isAdmin: true,
      }),
      adminAlt: await upsertUser({
        id: `${prefix}-admin-alt`,
        email: `${prefix}.admin.alt@example.com`,
        password: `AdminAltPass!${index}`,
        name: `E2E Admin Alt ${index}`,
        isAdmin: true,
      }),
      member: await upsertUser({
        id: `${prefix}-member`,
        email: `${prefix}.member@example.com`,
        password: `MemberPass!${index}`,
        name: `E2E Member ${index}`,
        isAdmin: false,
      }),
      memberReadonly: await upsertUser({
        id: `${prefix}-member-readonly`,
        email: `${prefix}.member.readonly@example.com`,
        password: `MemberReadonlyPass!${index}`,
        name: `E2E Member Readonly ${index}`,
        isAdmin: false,
      }),
      candidate: await upsertUser({
        id: `${prefix}-candidate`,
        email: `${prefix}.candidate@example.com`,
        password: `CandidatePass!${index}`,
        name: `E2E Candidate ${index}`,
        isAdmin: false,
      }),
      mailUser: await upsertUser({
        id: `${prefix}-mail-user`,
        email: `${prefix}.mail@example.com`,
        password: `MailPass!${index}`,
        name: `E2E Mail ${index}`,
        isAdmin: false,
      }),
      victim: await upsertUser({
        id: `${prefix}-victim`,
        email: `${prefix}.victim@example.com`,
        password: `VictimPass!${index}`,
        name: `E2E Victim ${index}`,
        isAdmin: false,
      }),
      passwordReset: await upsertUser({
        id: `${prefix}-password-reset`,
        email: `${prefix}.password.reset@example.com`,
        password: `ResetPass!${index}`,
        name: `E2E Password Reset ${index}`,
        isAdmin: false,
      }),
      deleteTarget: await upsertUser({
        id: `${prefix}-delete-target`,
        email: `${prefix}.delete.target@example.com`,
        password: `DeletePass!${index}`,
        name: `E2E Delete Target ${index}`,
        isAdmin: false,
      }),
    } satisfies Record<SeedUserName, SeedUser>

    const membersOrgSlug = `${prefix}-members-org`
    const invitesOrgSlug = `${prefix}-invites-org`
    const membersReadonlyOrgSlug = `${prefix}-members-readonly-org`
    const joinEdgeOrgSlug = `${prefix}-join-edge-org`

    const membersOrg = await upsertOrg({
      slug: membersOrgSlug,
      name: `E2E Members Org ${index}`,
    })

    const invitesOrg = await upsertOrg({
      slug: invitesOrgSlug,
      name: `E2E Invites Org ${index}`,
    })

    const membersReadonlyOrg = await upsertOrg({
      slug: membersReadonlyOrgSlug,
      name: `E2E Members Readonly Org ${index}`,
    })

    const joinEdgeOrg = await upsertOrg({
      slug: joinEdgeOrgSlug,
      name: `E2E Join Edge Org ${index}`,
    })

    const allSeededUserIds = Object.values(users).map((user) => user.id)

    await syncOrgMemberships({
      organizationId: membersOrg.id,
      admins: [users.owner.id],
      members: [users.member.id],
      allSeededUserIds,
    })

    await syncOrgMemberships({
      organizationId: invitesOrg.id,
      admins: [users.owner.id],
      members: [],
      allSeededUserIds,
    })

    await syncOrgMemberships({
      organizationId: membersReadonlyOrg.id,
      admins: [users.owner.id],
      members: [users.memberReadonly.id],
      allSeededUserIds,
    })

    await syncOrgMemberships({
      organizationId: joinEdgeOrg.id,
      admins: [users.owner.id],
      members: [],
      allSeededUserIds,
    })

    const joinEdgeInviteCodes = {
      valid: `${prefix}-join-valid`,
      expired: `${prefix}-join-expired`,
      maxed: `${prefix}-join-maxed`,
    } as const

    await upsertInviteCode({
      id: joinEdgeInviteCodes.valid,
      organizationId: joinEdgeOrg.id,
      role: 'member',
      createdById: users.owner.id,
      updatedById: users.owner.id,
      expiresAt: null,
      usesMax: 20,
      usesCurrent: 0,
    })

    await upsertInviteCode({
      id: joinEdgeInviteCodes.expired,
      organizationId: joinEdgeOrg.id,
      role: 'member',
      createdById: users.owner.id,
      updatedById: users.owner.id,
      expiresAt: new Date(Date.now() - 60 * 60 * 1000),
      usesMax: 20,
      usesCurrent: 0,
    })

    await upsertInviteCode({
      id: joinEdgeInviteCodes.maxed,
      organizationId: joinEdgeOrg.id,
      role: 'member',
      createdById: users.owner.id,
      updatedById: users.owner.id,
      expiresAt: null,
      usesMax: 1,
      usesCurrent: 1,
    })

    partitions.push({
      index,
      orgs: {
        members: membersOrg.slug,
        invites: invitesOrg.slug,
        membersReadonly: membersReadonlyOrg.slug,
        joinEdge: joinEdgeOrg.slug,
      },
      inviteCodes: {
        joinEdge: joinEdgeInviteCodes,
      },
      users,
    })
  }

  const manifest: SeedManifest = {
    runId,
    createdAt: new Date().toISOString(),
    workers,
    partitions,
  }

  await writeManifest(manifest)

  console.log(`Seeded ${workers} e2e partition(s)`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

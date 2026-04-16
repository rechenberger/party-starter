import { getMyUser } from '@/auth/getMyUser'
import { createClient, db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { SIDEBAR, ORGS } from '@/lib/starter.config'
import { superCache } from '@/lib/superCache'
import { asc, desc, eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { after } from 'next/server'
import { canUserCreateOrg } from './canUserCreateOrg'
import { LAST_USED_ORG_COOKIE_NAME } from './lastUsedOrgCookie'

export type CurrentOrgContext = {
  org: {
    id: string
    slug: string
    name: string
  }
  membership: {
    id: string
    role: 'admin' | 'member'
    userId: string
    organizationId: string
  }
  memberships: Array<{
    id: string
    role: 'admin' | 'member'
    organization: {
      id: string
      slug: string
      name: string
    }
  }>
}

type MembershipRow = CurrentOrgContext['memberships'][number] & {
  userId: string
  organizationId: string
  createdAt: Date
}

const assertCurrentOrgConfig = () => {
  if (ORGS.forceOrg && !ORGS.isActive) {
    throw new Error(
      'Invalid starter config: ORGS.forceOrg=true requires ORGS.isActive=true.',
    )
  }

  if (ORGS.forceOrg && SIDEBAR.activeInMain === false) {
    throw new Error(
      'Invalid starter config: ORGS.forceOrg=true requires SIDEBAR.activeInMain to stay visible for logged-in users.',
    )
  }
}

const getMembershipRows = async ({ userId }: { userId: string }) => {
  return db.query.organizationMemberships.findMany({
    where: eq(schema.organizationMemberships.userId, userId),
    columns: {
      id: true,
      role: true,
      userId: true,
      organizationId: true,
      createdAt: true,
    },
    with: {
      organization: {
        columns: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
    orderBy: [
      desc(schema.organizationMemberships.createdAt),
      asc(schema.organizationMemberships.organizationId),
    ],
  }) as Promise<MembershipRow[]>
}

const toCurrentOrgContext = ({
  activeMembership,
  memberships,
}: {
  activeMembership: MembershipRow
  memberships: MembershipRow[]
}): CurrentOrgContext => {
  return {
    org: activeMembership.organization,
    membership: {
      id: activeMembership.id,
      role: activeMembership.role,
      userId: activeMembership.userId,
      organizationId: activeMembership.organizationId,
    },
    memberships: memberships.map(({ id, role, organization }) => ({
      id,
      role,
      organization,
    })),
  }
}

const getDefaultOrgName = ({
  userId,
  userName,
  userEmail,
}: {
  userId: string
  userName?: string | null
  userEmail?: string | null
}) => {
  const trimmedName = userName?.trim()
  if (trimmedName) {
    return trimmedName
  }

  const emailLocalPart = userEmail?.split('@').at(0)?.trim()
  if (emailLocalPart) {
    return emailLocalPart
  }

  return userId
}

const createDefaultOrgForUser = async ({
  userId,
  userName,
  userEmail,
}: {
  userId: string
  userName?: string | null
  userEmail?: string | null
}): Promise<CurrentOrgContext> => {
  const { db: transactionDb, client } = await createClient()

  try {
    const context = await transactionDb.transaction(async (tx) => {
      const existingOrg = await tx.query.organizations.findFirst({
        where: eq(schema.organizations.slug, userId),
        columns: {
          id: true,
        },
      })

      if (existingOrg) {
        throw new Error(
          `Unable to auto-create organization for user ${userId}: slug "${userId}" is already in use.`,
        )
      }

      let org:
        | {
            id: string
            slug: string
            name: string
          }
        | undefined

      try {
        ;[org] = await tx
          .insert(schema.organizations)
          .values({
            slug: userId,
            name: getDefaultOrgName({ userId, userName, userEmail }),
          })
          .returning({
            id: schema.organizations.id,
            slug: schema.organizations.slug,
            name: schema.organizations.name,
          })
      } catch (error) {
        throw new Error(
          `Unable to auto-create organization for user ${userId}: slug "${userId}" is already in use.`,
          { cause: error },
        )
      }

      if (!org) {
        throw new Error(
          `Unable to auto-create organization for user ${userId}: organization insert returned no row.`,
        )
      }

      const [membership] = await tx
        .insert(schema.organizationMemberships)
        .values({
          userId,
          organizationId: org.id,
          role: 'admin',
        })
        .returning({
          id: schema.organizationMemberships.id,
          role: schema.organizationMemberships.role,
          userId: schema.organizationMemberships.userId,
          organizationId: schema.organizationMemberships.organizationId,
          createdAt: schema.organizationMemberships.createdAt,
        })

      if (!membership) {
        throw new Error(
          `Unable to auto-create organization for user ${userId}: membership insert returned no row.`,
        )
      }

      const activeMembership: MembershipRow = {
        ...membership,
        organization: org,
      }

      return toCurrentOrgContext({
        activeMembership,
        memberships: [activeMembership],
      })
    })

    after(() => {
      superCache.org({ id: context.org.id }).update()
      superCache.orgMembers({ orgId: context.org.id }).update()
      superCache.userOrgMemberships({ userId }).update()
    })

    return context
  } finally {
    await client.end()
  }
}

export const resolveCurrentOrgContext = async (options?: {
  routeOrgSlug?: string
}): Promise<CurrentOrgContext | null> => {
  assertCurrentOrgConfig()

  const user = await getMyUser()
  if (!user) {
    return null
  }

  const memberships = await getMembershipRows({ userId: user.id })

  if (options?.routeOrgSlug) {
    const activeMembership = memberships.find(
      (membership) => membership.organization.slug === options.routeOrgSlug,
    )

    if (!activeMembership) {
      return null
    }

    return toCurrentOrgContext({
      activeMembership,
      memberships,
    })
  }

  if (!ORGS.forceOrg) {
    return null
  }

  if (memberships.length > 0) {
    const cookieStore = await cookies()
    const lastUsedOrgSlug =
      cookieStore.get(LAST_USED_ORG_COOKIE_NAME)?.value?.trim() || undefined

    const activeMembership =
      memberships.find(
        (membership) => membership.organization.slug === lastUsedOrgSlug,
      ) ?? memberships[0]

    return toCurrentOrgContext({
      activeMembership,
      memberships,
    })
  }

  if (await canUserCreateOrg()) {
    return createDefaultOrgForUser({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    })
  }

  throw new Error(
    `Unable to resolve an active organization for user ${user.id}: the user has no memberships and cannot create an organization.`,
  )
}

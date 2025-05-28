import { getMyUserId } from '@/auth/getMyUser'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { getTranslations } from '@/i18n/getTranslations'
import { neverNullish, throwError } from '@/lib/neverNullish'
import { superCache } from '@/lib/superCache'
import { and, eq, inArray } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { OrganizationRole } from './organizationRoles'

export const getMembership = async ({
  allowedRoles,
  orgSlug,
  userId,
}: {
  allowedRoles?: OrganizationRole[]
  orgSlug: string
  userId: string
}) => {
  'use cache'
  const org = await db.query.organizations.findFirst({
    where: eq(schema.organizations.slug, orgSlug),
    with: {
      memberships: {
        where: and(
          eq(schema.organizationMemberships.userId, userId),
          allowedRoles
            ? inArray(schema.organizationMemberships.role, allowedRoles)
            : undefined,
        ),
      },
    },
  })

  if (!org) {
    superCache.orgs().tag()
    return null
  }

  superCache.org({ id: org.id }).tag()
  superCache.orgMembers({ orgId: org.id }).tag()
  superCache.userOrgMemberships({ userId }).tag()

  const membership = org?.memberships.at(0)
  if (!membership) {
    return null
  }

  return { org, membership }
}

export const getMyMembership = async ({
  allowedRoles,
  orgSlug,
}: {
  allowedRoles?: OrganizationRole[]
  orgSlug: string
}) => {
  const userId = await getMyUserId()

  if (!userId || !orgSlug) {
    return null
  }
  return await getMembership({
    allowedRoles,
    orgSlug,
    userId,
  })
}

export const getMyMembershipOrThrow = neverNullish(
  getMyMembership,
  async () => {
    const t = await getTranslations()
    return throwError(t.org.membershipNotFound)()
  },
)
export const getMyMembershipOrNotFound = neverNullish(getMyMembership, notFound)

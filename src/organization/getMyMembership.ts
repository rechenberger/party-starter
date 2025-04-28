import { getMyUser } from '@/auth/getMyUser'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { neverNullish, throwError } from '@/lib/neverNullish'
import { and, eq, inArray } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { getCurrentOrgSlug } from './getCurrentOrgSlug'
import { OrganizationRole } from './organizationSchema'

export const getMyMembership = async ({
  allowedRoles,
}: {
  allowedRoles?: OrganizationRole[]
} = {}) => {
  const [orgSlug, user] = await Promise.all([getCurrentOrgSlug(), getMyUser()])

  if (!user || !orgSlug) {
    return null
  }

  const org = await db.query.organizationsTable.findFirst({
    where: eq(schema.organizationsTable.slug, orgSlug),
    with: {
      memberships: {
        where: and(
          eq(schema.organizationMembershipsTable.userId, user.id),
          allowedRoles
            ? inArray(schema.organizationMembershipsTable.role, allowedRoles)
            : undefined,
        ),
      },
    },
  })

  return org?.memberships.at(0)
}

export const getMyMembershipOrThrow = neverNullish(
  getMyMembership,
  throwError('Membership not found'),
)

export const getMyMembershipOrNotFound = neverNullish(getMyMembership, notFound)

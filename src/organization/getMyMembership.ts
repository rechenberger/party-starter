import { getMyUser } from '@/auth/getMyUser'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { neverNullish, throwError } from '@/lib/neverNullish'
import { and, eq, inArray } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { OrganizationRole } from '../db/schema-organizations'
import { getCurrentOrgSlug } from './getCurrentOrgSlug'

export const getMyMembership = async ({
  allowedRoles,
}: {
  allowedRoles?: OrganizationRole[]
} = {}) => {
  const [orgSlug, user] = await Promise.all([getCurrentOrgSlug(), getMyUser()])

  if (!user || !orgSlug) {
    return null
  }

  const org = await db.query.organizations.findFirst({
    where: eq(schema.organizations.slug, orgSlug),
    with: {
      memberships: {
        where: and(
          eq(schema.organizationMemberships.userId, user.id),
          allowedRoles
            ? inArray(schema.organizationMemberships.role, allowedRoles)
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

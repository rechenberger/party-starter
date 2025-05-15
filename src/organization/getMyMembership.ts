import { getMyUserId } from '@/auth/getMyUser'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { neverNullish, throwError } from '@/lib/neverNullish'
import { and, eq, inArray } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { getCurrentOrgSlug } from './getCurrentOrgSlug'
import { OrganizationRole } from './organizationRoles'

export const getMyMembership = async ({
  allowedRoles,
  orgSlug: inputOrgSlug,
}: {
  allowedRoles?: OrganizationRole[]
  orgSlug?: string
} = {}) => {
  const [orgSlug, userId] = await Promise.all([
    inputOrgSlug ?? getCurrentOrgSlug(),
    getMyUserId(),
  ])

  if (!userId || !orgSlug) {
    return null
  }

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
  const membership = org?.memberships.at(0)
  const valid = !!org && !!membership

  return valid ? { org, membership } : null
}

export const getMyMembershipOrThrow = neverNullish(
  getMyMembership,
  throwError('Membership not found'),
)

export const getMyMembershipOrNotFound = neverNullish(getMyMembership, notFound)

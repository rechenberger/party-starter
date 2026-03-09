import { convexApi, convexNext } from '@/auth/convex-next'
import { getTranslations } from '@/i18n/getTranslations'
import { neverNullish, throwError } from '@/lib/neverNullish'
import { notFound } from 'next/navigation'
import { OrganizationRole } from './organizationRoles'

export const getMembership = async ({
  allowedRoles,
  orgSlug,
}: {
  allowedRoles?: OrganizationRole[]
  orgSlug: string
  userId?: string
}) => {
  const result = (await convexNext.fetchAuthQuery(
    convexApi.organizations.myMembershipBySlug,
    { orgSlug },
  )) as {
    org: {
      id: string
      name: string
      slug: string
      createdAt: number
    }
    membership: {
      id: string
      userId: string
      role: OrganizationRole
      createdAt: number
    }
  } | null

  if (!result) return null
  if (allowedRoles && !allowedRoles.includes(result.membership.role)) {
    return null
  }

  return result
}

export const getMyMembership = async ({
  allowedRoles,
  orgSlug,
}: {
  allowedRoles?: OrganizationRole[]
  orgSlug: string
}) => {
  return getMembership({ allowedRoles, orgSlug })
}

export const getMyMembershipOrThrow = neverNullish(
  getMyMembership,
  async () => {
    const t = await getTranslations()
    return throwError(t.org.membershipNotFound)()
  },
)

export const getMyMembershipOrNotFound = neverNullish(getMyMembership, notFound)

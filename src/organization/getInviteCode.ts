import { getMyUserOrLogin } from '@/auth/getMyUser'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { and, eq, isNull } from 'drizzle-orm'

export const getInviteCode = async ({
  orgSlug,
  code,
}: {
  orgSlug: string
  code: string
}) => {
  const user = await getMyUserOrLogin({
    forceRedirectUrl: `/join/${orgSlug}/${code}`,
  })

  const organization = await db.query.organizations.findFirst({
    where: eq(schema.organizations.slug, orgSlug),
    with: {
      memberships: true,
    },
  })

  if (!organization) {
    return { error: 'Organization not found' as const }
  }

  const inviteCode = await db.query.inviteCodes.findFirst({
    where: and(
      eq(schema.inviteCodes.id, code),
      eq(schema.inviteCodes.organizationId, organization.id),
      isNull(schema.inviteCodes.deletedAt),
    ),
  })

  if (!inviteCode) {
    return { error: 'Invite code not found' as const, organization }
  }

  if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
    return { error: 'Expired' as const, organization }
  } else if (
    inviteCode.usesMax &&
    inviteCode.usesCurrent &&
    inviteCode.usesCurrent >= inviteCode.usesMax
  ) {
    return { error: 'Max uses reached' as const, organization }
  }

  return { inviteCode, organization, user }
}

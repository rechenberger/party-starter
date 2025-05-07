import { getMyUserOrLogin } from '@/auth/getMyUser'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { InviteCode } from '@/db/schema-zod'
import { isPast } from 'date-fns'
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

  const inviteCodeRaw = await db.query.inviteCodes.findFirst({
    where: and(
      eq(schema.inviteCodes.id, code),
      eq(schema.inviteCodes.organizationId, organization.id),
      isNull(schema.inviteCodes.deletedAt),
    ),
  })

  if (!inviteCodeRaw) {
    return { error: 'Invite code not found' as const, organization }
  }

  const inviteCode = getEnhancedInviteCode(inviteCodeRaw)

  if (inviteCode.isExpired) {
    return { error: 'Expired' as const, organization, inviteCode, user }
  } else if (inviteCode.isCompletelyUsed) {
    return {
      error: 'Max uses reached' as const,
      organization,
      inviteCode,
      user,
    }
  }

  return {
    inviteCode,
    organization,
    user,
  }
}

export const getEnhancedInviteCode = <
  T extends Pick<
    InviteCode,
    'expiresAt' | 'usesCurrent' | 'usesMax' | 'sentToEmail'
  >,
>(
  inviteCode: T,
) => {
  return {
    ...inviteCode,
    isExpired: !!(inviteCode.expiresAt && isPast(inviteCode.expiresAt)),
    isCompletelyUsed:
      inviteCode.usesMax &&
      inviteCode.usesCurrent &&
      inviteCode.usesCurrent >= inviteCode.usesMax,
    sentViaMail: !!inviteCode.sentToEmail,
  }
}

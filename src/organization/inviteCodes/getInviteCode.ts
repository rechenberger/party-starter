import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { InviteCode } from '@/db/schema-zod'
import { superCache } from '@/lib/superCache'
import { isPast } from 'date-fns'
import { and, eq, isNull } from 'drizzle-orm'

export const getInviteCode = async ({
  orgSlug,
  code,
}: {
  orgSlug: string
  code: string
}) => {
  'use cache'

  const org = await db.query.organizations.findFirst({
    where: eq(schema.organizations.slug, orgSlug),
    with: {
      memberships: true,
    },
  })

  if (!org) {
    superCache.orgs().tag()
    return { error: 'Organization not found' as const }
  }
  superCache.org({ id: org.id }).tag()
  superCache.orgMembers({ orgId: org.id }).tag()

  const inviteCodeRaw = await db.query.inviteCodes.findFirst({
    where: and(
      eq(schema.inviteCodes.id, code),
      eq(schema.inviteCodes.organizationId, org.id),
      isNull(schema.inviteCodes.deletedAt),
    ),
  })

  if (!inviteCodeRaw) {
    return { error: 'Invite code not found' as const, org }
  }

  const inviteCode = getEnhancedInviteCode(inviteCodeRaw)

  if (inviteCode.isExpired) {
    return { error: 'Expired' as const, org, inviteCode }
  } else if (inviteCode.isCompletelyUsed) {
    return {
      error: 'Max uses reached' as const,
      org,
      inviteCode,
    }
  }

  return {
    inviteCode,
    org,
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

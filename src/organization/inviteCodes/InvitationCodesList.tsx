import { InviteCode, User } from '@/db/schema-zod'
import { isPast } from 'date-fns'
import { getMyMembershipOrNotFound } from '../getMyMembership'
import { OrganizationRole } from '../organizationRoles'
import { MailInvitationCodesList } from './MailInvitationCodesList'
import { NormalInviteCodesTable } from './NormalInviteCodesTable'

const allowedRoles: OrganizationRole[] = ['admin']

export type InviteCodesForList = (InviteCode & {
  createdBy: Pick<User, 'name' | 'email' | 'image'> | null
})[]

export type InvitationCodesListProps = {
  inviteCodes: InviteCodesForList
  id: string
  slug: string
  name: string
}

export const InvitationCodesList = async (props: InvitationCodesListProps) => {
  await getMyMembershipOrNotFound({
    allowedRoles,
  })

  const { inviteCodes } = props
  const codesWithIsValid = inviteCodes.map((code) => {
    return {
      ...code,
      isExpired: code.expiresAt && isPast(code.expiresAt),
      isCompletelyUsed: (code.usesCurrent ?? 0) >= (code.usesMax ?? 1),
      sentViaMail: !!code.sentToEmail,
    }
  })

  const validNormalCodes: typeof codesWithIsValid = []
  const emailCodes: typeof codesWithIsValid = []

  for (const code of codesWithIsValid) {
    if (code.isCompletelyUsed) {
      continue
    }
    // email codes should know if they expired to resend them, accepted ones are hidden
    if (code.sentViaMail) {
      emailCodes.push(code)
    }

    if (!code.sentViaMail && !code.isExpired) {
      validNormalCodes.push(code)
    }
  }

  return (
    <>
      <MailInvitationCodesList {...props} inviteCodes={emailCodes} />
      <NormalInviteCodesTable {...props} inviteCodes={validNormalCodes} />
    </>
  )
}

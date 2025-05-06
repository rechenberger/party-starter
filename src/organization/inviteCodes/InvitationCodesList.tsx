import { InviteCode, User } from '@/db/schema-zod'
import { isPast } from 'date-fns'
import { getMyMembershipOrThrow } from '../getMyMembership'
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
  const { inviteCodes } = props
  await getMyMembershipOrThrow({
    allowedRoles,
  })

  const codesWithIsValid = inviteCodes.map((code) => {
    return {
      ...code,
      isExpired: code.expiresAt && isPast(code.expiresAt),
      isCompletelyUsed: code.usesCurrent === code.usesMax,
      sentViaMail: !!code.sentToEmail,
    }
  })

  const invalidCodes: typeof codesWithIsValid = []
  const validNormalCodes: typeof codesWithIsValid = []
  const emailCodes: typeof codesWithIsValid = []

  for (const code of codesWithIsValid) {
    // email codes should know if they expired to resend them, accepted ones are hidden
    if (code.sentViaMail && !code.isCompletelyUsed) {
      emailCodes.push(code)
    } else if (!code.isExpired && !code.isCompletelyUsed) {
      validNormalCodes.push(code)
    } else {
      invalidCodes.push(code)
    }
  }

  return (
    <>
      <MailInvitationCodesList {...props} inviteCodes={emailCodes} />
      <NormalInviteCodesTable {...props} inviteCodes={validNormalCodes} />
    </>
  )
}

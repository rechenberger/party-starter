import { InviteCode, User } from '@/db/schema-zod'
import { isFuture } from 'date-fns'
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
      isValid:
        (!code.expiresAt || isFuture(code.expiresAt)) &&
        (!code.usesMax || (code.usesCurrent ?? 0) < code.usesMax),
      sentViaMail: !!code.sentToEmail,
    }
  })

  const invalidCodes: typeof codesWithIsValid = []
  const validNormalCodes: typeof codesWithIsValid = []
  const emailCodes: typeof codesWithIsValid = []

  for (const code of codesWithIsValid) {
    // email codes should know if they expired to resend or have no uses to show invitation accepted
    if (code.sentViaMail) {
      emailCodes.push(code)
    } else if (code.isValid) {
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

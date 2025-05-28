import { InviteCode, User } from '@/db/schema-zod'
import { getMyMembershipOrNotFound } from '../getMyMembership'
import { OrganizationRole } from '../organizationRoles'
import { getEnhancedInviteCode } from './getInviteCode'
import { MailInvitationCodesList } from './MailInvitationCodesList'
import { NormalInviteCodesTable } from './NormalInviteCodesTable'
const allowedRoles: OrganizationRole[] = ['admin']

export type EnhancedInviteCodeForList = ReturnType<
  typeof getEnhancedInviteCode<InviteCode>
>

export type InviteCodesForList = (EnhancedInviteCodeForList & {
  updatedBy: Pick<User, 'name' | 'email' | 'image'> | null
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
    orgSlug: props.slug,
  })

  const { inviteCodes } = props

  const validNormalCodes: InviteCodesForList = []
  const emailCodes: InviteCodesForList = []

  for (const code of inviteCodes) {
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

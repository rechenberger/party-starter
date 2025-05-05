import { ExpiresAt } from '@/organization/inviteCodes/CreateInviteCodeFormClient'

export const ORGS = {
  isActive: true,
  onlyAdminsCanCreateOrgs: false,
  defaultExpirationEmailInvitation: '1d' satisfies ExpiresAt,
} as const

import 'server-only'

import { ExpiresAt } from '@/organization/inviteCodes/CreateInviteCodeFormClient'

export const ORGS = {
  isActive: true,
  onlyAdminsCanCreateOrgs: false,
  defaultExpirationEmailInvitation: '1d' satisfies ExpiresAt,
} as const

export const BRAND = {
  name: 'Party Starter',
  Logo: () => (
    <strong>
      Party&nbsp;<span className="text-primary">Starter</span>
    </strong>
  ),
  github: {
    active: true,
    url: 'https://github.com/rechenberger/party-starter',
  },
}

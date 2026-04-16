import { type ExpirationTime } from '@/organization/inviteCodes/expirationTimes'

/**
 * Default starter config. The shipped E2E suite assumes this mode:
 * - ORGS.isActive = true
 * - LOCALIZATION.isActive = true
 * - SIDEBAR.activeInMain = 'loggedIn'
 * - ORGS.forceOrg = true
 */
export const ORGS = {
  isActive: true,
  forceOrg: true, // Affects redirect, sidebar, and active-org-context tests.
  onlyAdminsCanCreateOrgs: false,
  defaultExpirationEmailInvitation: '1d' satisfies ExpirationTime,
} as const

export const BRAND = {
  name: 'Party Starter',
  logoUrl: 'https://party-starter.vercel.app/logo.svg',
  TextLogo: () => (
    <strong>
      Party&nbsp;<span className="text-primary">Starter</span>
    </strong>
  ),
  metadata: {
    description:
      'by Tristan Rechenberger, Tim Weiskopf, Sean Dieterle & Kevin Graf',
  },
  github: {
    active: true,
    url: 'https://github.com/rechenberger/party-starter',
  },
  colors: {
    primary: '#79a913',
    primaryForeground: '#fafaf9',
  },
}

export const LOCALIZATION = {
  isActive: true,
}

export const SIDEBAR = {
  activeInMain: 'loggedIn' as 'loggedIn' | boolean,
}

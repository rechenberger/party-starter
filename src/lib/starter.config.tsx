import { type ExpirationTime } from '@/organization/inviteCodes/expirationTimes'

export const ORGS = {
  isActive: true,
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
  emails: {
    footer: {
      Signature: () => (
        <>
          Best regards
          <br />
          The Party Starter Team
          <br />
          🎉
        </>
      ),
    },
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

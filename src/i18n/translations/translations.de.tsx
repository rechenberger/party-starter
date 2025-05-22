import { TranslationsClient } from './translations.en'

export const t = {
  welcome: {
    title: (
      <>
        Willkommen im Party <b className="text-primary">Starter</b>
      </>
    ),
  },
  login: {
    forgotPassword: 'Passwort vergessen?',
    confirmPasswordMismatch: 'Passwörter stimmen nicht überein',
  },
  standardWords: {
    users: 'Benutzer',
  },
  org: {
    organization: 'Organisation',
    create: 'Organisation erstellen',
    members: 'Mitglieder',
    orgMembers: 'Organisationsmitglieder',
  },
} satisfies TranslationsClient

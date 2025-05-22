import { TranslationsClient } from './translations.en'

export const t = {
  landing: {
    title: (
      <>
        Willkommen im Party <b className="text-primary">Starter</b>
      </>
    ),
  },
  app: {
    welcome: 'Willkommen in der App',
  },
  userManagement: {
    passwordChanged: 'Das Passwort wurde geändert.',
    userNameChanged: 'Der Benutzername wurde geändert.',
    changePasswordTitle: 'Passwort ändern',
    changePasswordAction: 'Passwort ändern',
    changeUsernameTitle: 'Benutzername ändern',
    changeUsernameAction: 'Benutzername ändern',
  },
  standardWords: {
    users: 'Benutzer',
    redirecting: 'Weiterleitung...',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    skip: 'Überspringen',
    username: 'Benutzername',
    or: 'oder',
    email: 'E-Mail',
  },
  auth: {
    checkMailTitle: 'Überprüfen Sie Ihre E-Mails',
    checkMailDescription: (
      <>
        Wir haben Ihnen eine E-Mail zum Bestätigen Ihrer E-Mail-Adresse
        gesendet.
        <br />
        Dieser Browser-Tab kann jetzt geschlossen werden.
      </>
    ),
    emailNotVerifiedTitle: 'E-Mail nicht bestätigt',
    resendVerifyMailDescription: (email: string) => (
      <>
        <p>{`Wir haben Ihnen eine weitere Bestätigungse-Mail an ${email} gesendet.`}</p>
        <p>
          Bitte öffnen Sie die E-Mail und klicken Sie auf Anmelden, um Ihre
          E-Mail zu bestätigen.
        </p>
      </>
    ),
    continueWithDiscord: 'Mit Discord anmelden',
    forgotPassword: 'Passwort vergessen?',
    confirmPasswordMismatch: 'Passwörter stimmen nicht überein',
    loginTitle: 'Anmelden',
    registerTitle: 'Registrieren',
    registerAction: 'Registrieren',
    backToLogin: 'Zurück zur Anmeldung',
    acceptTerms: 'Nutzungsbedingungen akzeptieren',
  },
  org: {
    organization: 'Organisation',
    create: 'Organisation erstellen',
    members: 'Mitglieder',
    orgMembers: 'Organisationsmitglieder',
  },
} satisfies TranslationsClient

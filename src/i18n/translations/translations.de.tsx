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
    createUser: {
      title: 'Benutzer erstellen',
      create: 'Benutzer erstellen',
    },
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
    cancel: 'Abbrechen',
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
    join: {
      successTitle: 'Erfolgreich beigetreten!',
      successDescription: (organizationName: string) =>
        `Sie sind jetzt Mitglied von ${organizationName}.`,
      accessDescription: `Sie haben jetzt Zugriff auf alle Ressourcen, die mit Ihrer Rolle in dieser Organisation geteilt werden.`,
      goToOrganization: 'Zur Organisation',
      invalidInvitationTitle: 'Ungültige Einladung',
      invalidInvitationDescription:
        'Dieser Einladungs-Link kann nicht verwendet werden.',
      expiredInvitationDescription: 'Dieser Einladungs-Link ist abgelaufen.',
      maxUsesReachedDescription:
        'Dieser Einladungs-Link hat seine maximale Anzahl an Verwendungen erreicht.',
      returnToHome: 'Zurück zur Startseite',
      joinOrganization: 'Organisation beitreten',
      joinOrganizationDescription:
        'Sie haben eine Einladung erhalten, um einer Organisation beizutreten',
      adminRole: 'Admin Rolle',
      memberRole: 'Mitglieder Rolle',
      invitationCode: 'Einladungs Code',
    },
    createOrg: {
      title: 'Organisation erstellen',
      description: 'Erstellen Sie eine neue Organisation',
      name: 'Organisationsname',
      create: 'Organisation erstellen',
      placeholder: 'Geben Sie den Namen der Organisation ein',
    },
    missingPermission:
      'Sie sind nicht berechtigt, eine Organisation zu erstellen',
  },
} satisfies TranslationsClient

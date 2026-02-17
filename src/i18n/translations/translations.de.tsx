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
    loginAs: 'Einloggen als',
    currentUser: 'Aktueller Benutzer',
    createUser: {
      title: 'Benutzer erstellen',
      create: 'Benutzer erstellen',
    },
    deleteUser: {
      title: (name: string) => `Benutzer ${name} löschen`,
      success: (name: string) => `Benutzer ${name} gelöscht`,
      delete: 'Löschen',
      confirmation: {
        title: 'Wirklich löschen?',
        content: (name: string) =>
          `Dies wird den Benutzer ${name} unwiderruflich löschen`,
        confirm: 'Benutzer löschen',
      },
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
    areYouSure: 'Sind Sie sicher?',
    yes: 'Ja',
    no: 'Nein',
    copiedToClipboard: 'In die Zwischenablage kopiert',
    copyToClipboard: 'In die Zwischenablage kopieren',
    unknown: 'Unbekannt',
    created: 'Erstellt',
    homepage: 'Homepage',
    logout: 'Ausloggen',
    changeLanguage: 'Sprache ändern',
    changeTheme: 'Theme ändern',
    theme: {
      light: 'Hell',
      dark: 'Dunkel',
      system: 'System',
    },
    error: 'Fehler',
    anErrorOccurred: 'Ein Fehler ist aufgetreten.',
    logo: 'Logo',
    you: 'Du',
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
    emailAlreadyTaken:
      'Diese E-Mail Adresse ist bereits in Verwendung. Bitte verwenden Sie den Link zum Zurücksetzen des Passworts, um Ihr Passwort zurückzusetzen.',
    invalidCredentials: 'Ungültige Anmeldeinformationen',
    loginAction: 'Anmelden',
  },
  users: {
    title: 'Benutzer',
    emailVerified: 'E-Mail bestätigt',
    emailNotVerified: 'E-Mail nicht bestätigt',
    admin: 'Admin',
    removeAdmin: (email: string) => `Admin von ${email} entfernen`,
    makeAdmin: (email: string) => `${email} zu Admin machen`,
    removedAdmin: 'Admin entfernt',
    madeAdmin: 'Admin gemacht',
    removeAdminDescription: (email: string) => (
      <>
        Benutzer {email} ist <b>kein</b> Admin mehr
      </>
    ),
    makeAdminDescription: (email: string) =>
      `Benutzer ${email} ist jetzt ein Admin`,
    allUsers: 'Alle Benutzer',
    admins: 'Admins',
  },
  org: {
    organization: 'Organisation',
    organizations: 'Organisationen',
    create: 'Organisation erstellen',
    selectOrganization: 'Organisation auswählen',
    settings: 'Einstellungen',
    dashboardTopHeader: (orgName: string) => `Dashboard für ${orgName}`,
    settingsTopHeader: (orgName: string) => `Einstellungen für ${orgName}`,
    members: {
      title: 'Mitglieder',
      description: 'Mitglieder der Organisation',
      searchPlaceholder: 'Mitglied suchen...',
      noMembers:
        'Keine Mitglieder gefunden. Erstellen Sie ein Mitglied, um zu beginnen.',
      member: 'Mitglied',
      members: 'Mitglieder',
      role: 'Rolle',
      joined: 'Beigetreten',
      actions: 'Aktionen',
      clearSearch: 'Suche löschen',
      selectRolePlaceholder: 'Rolle auswählen',
    },
    orgMembers: 'Organisationsmitglieder',
    leave: {
      title: 'Organisation verlassen',
      content:
        'Sind Sie sicher, dass Sie diese Organisation verlassen möchten?',
      action: 'Organisation verlassen',
      confirmation: {
        title: 'Wirklich verlassen?',
        content:
          'Sind Sie sicher, dass Sie diese Organisation verlassen möchten?',
        confirm: 'Organisation verlassen',
      },
      cannotRemoveLastAdmin: 'Sie können den letzten Admin nicht entfernen.',
      cannotRemoveLastAdminDescription:
        'Bitte weisen Sie einen anderen Admin vorher zu. Andernfalls können Sie die gesamte Organisation löschen.',
    },
    kick: {
      title: 'Benutzer entfernen',
      content:
        'Sind Sie sicher, dass Sie diesen Benutzer aus dieser Organisation entfernen möchten?',
      action: 'Benutzer entfernen',
      confirmation: {
        title: 'Wirklich entfernen?',
        content: (name: string) =>
          `Sind Sie sicher, dass Sie ${name} aus dieser Organisation entfernen möchten?`,
        confirm: 'Benutzer entfernen',
      },
    },
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
    deleteOrg: {
      title: 'Organisation löschen',
      description:
        'Diese Aktion kann nicht rückgängig gemacht werden. Dies wird die Organisation unwiderruflich löschen und alle Zugriffe für alle Teammitglieder entfernen.',
      confirmation: {
        title: 'Wirklich löschen?',
        content: (name: string) =>
          `Sind Sie sicher, dass Sie ${name} löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.`,
        confirm: 'Organisation löschen',
      },
      delete: 'Organisation löschen',
      dangerZone: 'Gefahrenzone',
    },
    missingPermission:
      'Sie sind nicht berechtigt, eine Organisation zu erstellen',
    membershipNotFound: 'Mitgliedschaft nicht gefunden',
  },
  inviteCodes: {
    normalCodes: {
      title: 'Einladungscodes',
      create: 'Einladungscode erstellen',
      createDescription:
        'Erstellen Sie einen Einladungscode und teilen Sie ihn mit anderen, um sie in diese Organisation einzuladen.',
    },
    mailInvitations: {
      title: 'E-Mail Einladungen',
      create: 'E-Mail Einladung erstellen',
      createDescription:
        'Erstellen Sie eine E-Mail Einladung und senden Sie sie an eine E-Mail Adresse, um sie in diese Organisation einzuladen.',
      createSuccess: (emails: string) => `Einladung an ${emails} gesendet`,
      resendConfirmation: {
        title: 'Einladung erneut senden',
        content: (sentToEmail: string) =>
          `Sind Sie sicher, dass Sie die Einladung an ${sentToEmail} erneut senden möchten?`,
      },
      noEmailFound: 'Keine E-Mail Adresse gefunden',
    },
    errors: {
      noExistingCodeFound: 'Kein bestehender Code gefunden',
    },
    createForm: {
      success: 'Einladungscode erstellt und in die Zwischenablage kopiert',
      role: 'Rolle',
      selectRole: 'Rolle auswählen',
      expiresAt: 'Ablaufdatum',
      selectExpiresAt: 'Ablaufdatum auswählen',
      usesMax: 'Maximale Anzahl an Verwendungen',
      usesMaxPlaceholder: 'Unbegrenzt',
      comment: 'Kommentar',
      commentPlaceholder: 'Fügen einen optionalen Kommentar hinzu',
      create: 'Einladungscode erstellen',
      receiver: 'Empfänger',
      atLeastOneEmailInvalid: 'Mindestens eine E-Mail Adresse ist ungültig',
      sending: 'Senden...',
      sendInvitation: 'Einladung senden',
    },
    table: {
      code: 'Code',
      role: 'Rolle',
      expires: 'Ablaufdatum',
      usesLeft: 'Verbl. Verw.',
      updatedBy: 'Aktualisiert von',
      comment: 'Kommentar',
      actions: 'Aktionen',
      noInvitationCodes:
        'Keine Einladungscodes gefunden. Erstellen Sie einen, um zu beginnen.',
      receiver: 'Empfänger',
      status: 'Status',
      sentAt: 'Gesendet',
      sentBy: 'Gesendet von',
      noMailInvitations:
        'Keine E-Mail Einladungen gefunden. Erstellen Sie eine, um zu beginnen.',
    },
    status: {
      pending: 'Ausstehend',
      accepted: 'Akzeptiert',
      expired: 'Abgelaufen',
    },
    delete: {
      action: 'Einladungscode löschen',
      confirmation: {
        title: 'Wirklich löschen?',
        content: 'Dies wird den Einladungscode unwiderruflich löschen',
        confirm: 'Einladungscode löschen',
      },
    },
  },
  roles: {
    admin: 'Admin',
    member: 'Mitglied',
  },
  expirationTimes: {
    oneDay: '1 Tag',
    oneWeek: '1 Woche',
    oneMonth: '1 Monat',
    oneYear: '1 Jahr',
    never: 'Nie',
  },
  nav: {
    home: 'Home',
    users: 'Benutzer',
    crons: 'Cron Jobs',
    emails: 'E-Mails',
    dashboard: 'Dashboard',
  },
  emailsLog: {
    title: 'E-Mails',
    description: 'Alle vom System erzeugten ausgehenden E-Mails',
    filters: {
      title: 'Filter',
      to: 'Empfänger',
      template: 'Template',
      runId: 'Run ID',
      status: 'Status',
      apply: 'Anwenden',
      clear: 'Zurücksetzen',
      toPlaceholder: 'empfaenger@example.com',
      templatePlaceholder: 'verify-email',
      runIdPlaceholder: 'dev',
      statusAny: 'Alle Status',
    },
    table: {
      createdAt: 'Erstellt',
      template: 'Template',
      to: 'Empfänger',
      subject: 'Betreff',
      status: 'Status',
      actions: 'Aktionen',
      open: 'Öffnen',
      noEmailsFound: 'Keine E-Mails gefunden.',
    },
    detail: {
      title: 'E-Mail Details',
      description: 'Vollständige Daten der ausgewählten E-Mail',
      noSelection: 'Wählen Sie eine E-Mail aus der Liste aus.',
      notFound: 'Die ausgewählte E-Mail wurde nicht gefunden.',
      from: 'Von',
      to: 'An',
      locale: 'Locale',
      provider: 'Provider',
      template: 'Template',
      status: 'Status',
      sentAt: 'Gesendet am',
      runId: 'Run ID',
      error: 'Fehler',
      html: 'HTML',
      text: 'Text',
      htmlPreview: 'HTML Vorschau',
    },
    status: {
      queued: 'Wartend',
      sent: 'Gesendet',
      skipped: 'Übersprungen',
      failed: 'Fehlgeschlagen',
    },
    unknown: 'Unbekannt',
    notSentYet: 'Noch nicht gesendet',
    noError: 'Kein Fehler',
  },
  cron: {
    schedule: 'Zeitplan:',
    viewRuns: 'Läufe anzeigen',
    runNow: 'Jetzt ausführen',
    cronRuns: 'Cron Läufe',
    runs: 'Läufe',
    startedAt: 'Gestartet um',
    status: 'Status',
    duration: 'Dauer',
    lastHeartbeat: 'Letzter Herzschlag',
    endedAt: 'Beendet um',
    noHeartbeat: 'Kein Herzschlag',
    noCronRunsFound: 'Keine Cron Läufe gefunden für',
    runCronIfNotActiveQuestion: {
      title: 'Nicht aktiven Cron Job ausführen?',
      description:
        'Dieser Cron Job ist NICHT aktiv. Sind Sie sicher, dass Sie ihn trotzdem ausführen möchten?',
    },
  },
} satisfies TranslationsClient

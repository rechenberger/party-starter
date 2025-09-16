export const t = {
  landing: {
    title: (
      <>
        Welcome to Party <b className="text-primary">Starter</b>
      </>
    ),
  },
  app: {
    welcome: 'Welcome to the app',
  },
  userManagement: {
    passwordChanged: 'Your password has been changed.',
    userNameChanged: 'Your username has been changed.',
    changePasswordTitle: 'Change Password',
    changePasswordAction: 'Change Password',
    changeUsernameTitle: 'Change Username',
    changeUsernameAction: 'Change Username',
    loginAs: 'Login as',
    currentUser: 'Current User',
    createUser: {
      title: 'Create User',
      create: 'Create User',
    },
    deleteUser: {
      title: (name: string) => `Delete User ${name}`,
      success: (name: string) => `User ${name} deleted`,
      delete: 'Delete',
      confirmation: {
        title: 'Really delete?',
        content: (name: string) =>
          `This will permanently delete the user ${name}`,
        confirm: 'Delete User',
      },
    },
  },
  standardWords: {
    users: 'Users',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    redirecting: 'Redirecting...',
    skip: 'Skip',
    username: 'Username',
    or: 'or',
    email: 'Email',
    cancel: 'Cancel',
    areYouSure: 'Are you sure?',
    yes: 'Yes',
    no: 'No',
    copiedToClipboard: 'Copied to clipboard',
    copyToClipboard: 'Copy to clipboard',
    unknown: 'Unknown',
    created: 'Created',
    homepage: 'Homepage',
    logout: 'Logout',
    changeLanguage: 'Change Language',
    changeTheme: 'Change Theme',
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    error: 'Error',
    anErrorOccurred: 'An error occurred.',
    logo: 'logo',
    you: 'You',
  },
  auth: {
    checkMailTitle: 'Check your emails',
    checkMailDescription: (
      <>
        We have sent you an email to verify your email address.
        <br />
        You can close this browser window now.
      </>
    ),
    emailNotVerifiedTitle: 'Email not verified',
    resendVerifyMailDescription: (email: string) => (
      <>
        <p>{`We have sent you another verification email to ${email}`}</p>
        <p>Please open the email and click sign in to verify your email.</p>
      </>
    ),
    continueWithDiscord: 'Continue with Discord',

    forgotPassword: 'Forgot password?',
    confirmPasswordMismatch: 'Passwords do not match',
    loginTitle: 'Login',
    registerTitle: 'Register',
    registerAction: 'Register',
    backToLogin: 'Back to Login',
    acceptTerms: 'Accept Terms',
    emailAlreadyTaken:
      'This email is already taken. Please use the forgot password link to reset your password.',
    invalidCredentials: 'Invalid credentials',
    loginAction: 'Login',
  },
  users: {
    title: 'Users',
    emailVerified: 'Email Verified',
    emailNotVerified: 'Email Not Verified',
    admin: 'Admin',
    removeAdmin: (email: string) => `Remove Admin from ${email}`,
    makeAdmin: (email: string) => `Make ${email} an Admin`,
    removedAdmin: 'Removed Admin',
    madeAdmin: 'Made Admin',
    removeAdminDescription: (email: string) => (
      <>
        User {email} is <b>not</b> an admin anymore
      </>
    ),
    makeAdminDescription: (email: string) => `User ${email} is now an admin`,
    allUsers: 'All Users',
    admins: 'Admins',
  },
  org: {
    organization: 'Organization',
    organizations: 'Organizations',
    create: 'Create Organization',
    orgMembers: 'Organization Members',
    selectOrganization: 'Select an organization',
    settings: 'Settings',
    dashboardTopHeader: (orgName: string) => `Dashboard for ${orgName}`,
    settingsTopHeader: (orgName: string) => `Settings for ${orgName}`,
    members: {
      title: 'Members',
      description: 'Members of the organization',
      searchPlaceholder: 'Search members by name or email...',
      noMembers: 'No members found. Create one to get started.',
      member: 'Member',
      members: 'Members',
      role: 'Role',
      joined: 'Joined',
      actions: 'Actions',
      clearSearch: 'Clear search',
      selectRolePlaceholder: 'Select role',
    },
    leave: {
      title: 'Leave Organization',
      content: 'Are you sure you want to leave this organization?',
      action: 'Leave Organization',
      confirmation: {
        title: 'Really leave?',
        content: 'Are you sure you want to leave this organization?',
        confirm: 'Leave Organization',
      },
      cannotRemoveLastAdmin:
        'You cannot remove the last admin from the organization.',
      cannotRemoveLastAdminDescription:
        'Please assign another admin beforehand. Otherwise you can delete the whole organization.',
    },
    kick: {
      title: 'Kick User',
      content:
        'Are you sure you want to kick this user from this organization?',
      action: 'Kick User',
      confirmation: {
        title: 'Really kick?',
        content: (name: string) =>
          `Are you sure you want to kick ${name} from this organization?`,
        confirm: 'Kick User',
      },
    },
    join: {
      successTitle: 'Successfully Joined!',
      successDescription: (organizationName: string) =>
        `You are now a member of ${organizationName}.`,
      accessDescription: `You now have access to all resources shared with your Role in this organization.`,
      goToOrganization: 'Go to Organization',
      invalidInvitationTitle: 'Invalid Invitation',
      invalidInvitationDescription: 'This invitation link cannot be used.',
      expiredInvitationDescription: 'This invitation link has expired.',
      maxUsesReachedDescription:
        'This invitation link has reached its maximum number of uses.',
      returnToHome: 'Return to Home',
      joinOrganization: 'Join Organization',
      joinOrganizationDescription:
        'You have been invited to join an organization',
      adminRole: 'Admin Role',
      memberRole: 'Member Role',
      invitationCode: 'Invitation Code',
    },
    createOrg: {
      title: 'Create Organization',
      description: 'Create a new organization',
      name: 'Organization Name',
      create: 'Create Organization',
      placeholder: 'Enter organization name',
    },
    deleteOrg: {
      title: 'Delete Organization',
      description:
        'This action cannot be undone. This will permanently delete the organization and remove all access for all team members.',
      confirmation: {
        title: 'Really delete?',
        content: (name: string) =>
          `Are you sure you want to delete ${name}? This action cannot be undone.`,
        confirm: 'Delete Organization',
      },
      delete: 'Delete Organization',
      dangerZone: 'Danger Zone',
    },
    missingPermission: 'You are not allowed to create an organization',
    membershipNotFound: 'Membership not found',
  },
  inviteCodes: {
    normalCodes: {
      title: 'Invitation Codes',
      create: 'Create Invitation Code',
      createDescription:
        'Create and share the code with others to invite them to this organization.',
    },
    mailInvitations: {
      title: 'Mail Invitations',
      create: 'Create Mail Invitation',
      createDescription:
        'Create and send an email invitation to a user to join this organization.',
      createSuccess: (emails: string) => `Invitation sent to ${emails}`,
      resendConfirmation: {
        title: 'Resend invitation',
        content: (sentToEmail: string) =>
          `Are you sure you want to resend the invitation to ${sentToEmail}?`,
      },
      noEmailFound: 'No email found',
    },
    errors: {
      noExistingCodeFound: 'No existing code found',
    },
    createForm: {
      success: 'Invitation Code created and copied to clipboard',
      role: 'Role',
      selectRole: 'Select Role',
      expiresAt: 'Expires At',
      selectExpiresAt: 'Select Expires At',
      usesMax: 'Uses Max',
      usesMaxPlaceholder: 'Unlimited',
      comment: 'Comment',
      commentPlaceholder: 'Add an optional comment for yourself',
      create: 'Create Invitation Code',
      receiver: 'Receiver',
      atLeastOneEmailInvalid: 'At least one email address is invalid',
      sending: 'Sending...',
      sendInvitation: 'Send Invitation',
    },
    table: {
      code: 'Code',
      role: 'Role',
      expires: 'Expires',
      usesLeft: 'Uses Left',
      updatedBy: 'Updated By',
      comment: 'Comment',
      actions: 'Actions',
      noInvitationCodes:
        'No invitation codes found. Create one to get started.',
      receiver: 'Receiver',
      status: 'Status',
      sentAt: 'Sent At',
      sentBy: 'Sent By',
      noMailInvitations:
        'No mail invitations found. Create one to get started.',
    },
    status: {
      pending: 'Pending',
      accepted: 'Accepted',
      expired: 'Expired',
    },
    delete: {
      action: 'Delete Code',
      confirmation: {
        title: 'Really delete?',
        content: 'This will permanently delete the code',
        confirm: 'Delete Code',
      },
    },
  },
  roles: {
    admin: 'Admin',
    member: 'Member',
  },
  expirationTimes: {
    oneDay: '1 Day',
    oneWeek: '1 Week',
    oneMonth: '1 Month',
    oneYear: '1 Year',
    never: 'Never',
  },
  nav: {
    home: 'Home',
    users: 'Users',
    crons: 'Cron Jobs',
    dashboard: 'Dashboard',
  },
  cron: {
    schedule: 'Schedule:',
    viewRuns: 'View Runs',
    runNow: 'Run now',
    cronRuns: 'Cron Runs',
    runs: 'runs',
    startedAt: 'Started At',
    status: 'Status',
    duration: 'Duration',
    lastHeartbeat: 'Last Heartbeat',
    endedAt: 'Ended At',
    noHeartbeat: 'No heartbeat',
    noCronRunsFound: 'No cron runs found for',
    runCronIfNotActiveQuestion: {
      title: 'Run non active Cron Job?',
      description:
        'This cron job is NOT active. Are you sure you still want to run it?',
    },
  },
}

export type TranslationsClient = typeof t

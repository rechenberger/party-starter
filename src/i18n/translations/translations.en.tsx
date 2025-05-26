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
    createUser: {
      title: 'Create User',
      create: 'Create User',
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
  },
  org: {
    organization: 'Organization',
    create: 'Create Organization',
    members: 'Members',
    orgMembers: 'Organization Members',
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
    missingPermission: 'You are not allowed to create an organization',
  },
}

export type TranslationsClient = typeof t

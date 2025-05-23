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
  },
}

export type TranslationsClient = typeof t

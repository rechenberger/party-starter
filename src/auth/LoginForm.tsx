import { authClient } from './auth-client'
import { LoginFormClient } from './LoginFormClient'

export const LoginForm = ({ redirectUrl }: { redirectUrl?: string }) => {
  return <LoginFormClient authClient={authClient} redirectUrl={redirectUrl} />
}

import { LoginFormClient } from './LoginFormClient'

export const LoginForm = ({ redirectUrl }: { redirectUrl?: string }) => {
  return <LoginFormClient redirectUrl={redirectUrl} />
}

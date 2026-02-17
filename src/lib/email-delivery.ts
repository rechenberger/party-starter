const DEFAULT_EMAIL_FROM = 'Party Starter <no-reply@party-starter.local>'
const DEFAULT_SMTP_URL = 'smtp://e2e:e2e@127.0.0.1:2525'

const isTruthy = (value?: string) => {
  if (!value) return false
  const normalized = value.trim().toLowerCase()
  return (
    normalized === '1' ||
    normalized === 'true' ||
    normalized === 'yes' ||
    normalized === 'on'
  )
}

export const shouldActuallySendEmails = () => {
  return isTruthy(process.env.EMAIL_DELIVERY_ENABLED)
}

export const getEmailFromAddress = () => {
  return process.env.EMAIL_FROM?.trim() || DEFAULT_EMAIL_FROM
}

export const getEmailServerConfig = () => {
  return process.env.SMTP_URL?.trim() || DEFAULT_SMTP_URL
}

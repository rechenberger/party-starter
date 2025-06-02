import { BRAND } from '@/lib/starter.config'

export const t = {
  defaultTemplate: {
    footer: {
      signature: (
        <>
          Best regards
          <br />
          The {BRAND.name} Team
          <br />
          🎉
        </>
      ),
    },
  },
  orgInvite: {
    subjectText: ({ orgName }: { orgName: string }) =>
      `Join ${orgName} on ${BRAND.name}`,
    greeting: 'Hello',
    welcome: (orgName: string) => (
      <>
        Join <strong>{orgName}</strong> on <BRAND.TextLogo />
      </>
    ),
    description: ({
      invitedByUsername,
      invitedByEmail,
      orgName,
      role,
    }: {
      invitedByUsername: string | null
      invitedByEmail: string
      orgName: string
      role: string
    }) => (
      <>
        <strong>{invitedByUsername ?? invitedByEmail}</strong>
        {invitedByUsername && ` (${invitedByEmail})`} has invited you to the{' '}
        <strong>{orgName}</strong> organization as {role} on {BRAND.name}.
      </>
    ),
    joinButton: (orgName: string) => `Join ${orgName}`,
    fallback: 'or copy and paste this URL into your browser',
  },
  verifyEmail: {
    subjectText: `Login to ${BRAND.name}`,
    previewText: 'Verify your email address',
    title: 'Verify your email address',
    greeting: 'Hello',
    description: 'Please verify your email address by clicking the link below',
    verifyButton: '👉 Verify 👈',
    fallback: 'or copy and paste this URL into your browser',
  },
}

export type EmailTranslations = typeof t

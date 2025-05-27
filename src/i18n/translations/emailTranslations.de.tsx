import { BRAND } from '@/lib/starter.config'
import { t as emailTranslationsEn } from './emailTranslations.en'

export const t = {
  defaultTemplate: {
    footer: {
      signature: (
        <>
          Beste Grüße
          <br />
          Dein Party Starter Team
          <br />
          🎉
        </>
      ),
    },
  },
  orgInvite: {
    subjectText: (orgName: string, platformName: string) =>
      `Tritt ${orgName} auf ${platformName} bei`,
    greeting: 'Hallo',
    welcome: (orgName: string) => (
      <>
        Tritt <strong>{orgName}</strong> auf <BRAND.TextLogo /> bei
      </>
    ),
    description: ({
      invitedByUsername,
      invitedByEmail,
      orgName,
      role,
      platformName,
    }: {
      invitedByUsername: string | null
      invitedByEmail: string
      orgName: string
      role: string
      platformName: string
    }) => (
      <>
        <strong>{invitedByUsername ?? invitedByEmail}</strong>
        {invitedByUsername && ` (${invitedByEmail})`} hat dich eingeladen, um
        der Organisation <strong>{orgName}</strong> auf {platformName} als{' '}
        {role} beizutreten.
      </>
    ),
    joinButton: (orgName: string) => `${orgName} beitreten`,
    fallback: 'oder kopiere und füge diese URL in deinen Browser ein',
  },
  verifyEmail: {
    subjectText: (platformName: string) => `Login zu ${platformName}`,
    previewText: 'Bestätige deine E-Mail-Adresse',
    title: 'Bestätige deine E-Mail-Adresse',
    greeting: 'Hallo',
    description:
      'Bitte bestätige deine E-Mail-Adresse, indem du auf den Link unten klickst',
    verifyButton: '👉 Bestätigen 👈',
    fallback: 'oder kopiere und füge diese URL in deinen Browser ein',
  },
} satisfies typeof emailTranslationsEn

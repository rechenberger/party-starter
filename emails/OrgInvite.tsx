import { getEmailTranslations } from '@/i18n/getEmailTranslations'
import { DEFAULT_LOCALE, Locale } from '@/i18n/locale'
import { BRAND } from '@/lib/starter.config'
import { Button, Heading, Link, Section, Text } from '@react-email/components'
import { DefaultTemplate } from './DefaultTemplate'

type OrgInviteProps = {
  invitedByUsername: string | null
  invitedByEmail: string
  orgName: string
  inviteLink: string
  role: 'admin' | 'member'
  locale?: Locale
}

export const OrgInvite = async ({
  invitedByUsername,
  invitedByEmail,
  orgName,
  inviteLink,
  role,
  locale = DEFAULT_LOCALE,
}: OrgInviteProps) => {
  const { orgInvite: t } = await getEmailTranslations(locale)

  const previewText = `Join ${invitedByUsername} on ${BRAND.name}`
  return (
    <DefaultTemplate previewText={previewText} locale={locale}>
      <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
        {t.welcome(orgName)}
      </Heading>
      <Text className="text-black text-[14px] leading-[24px]">
        {t.greeting}
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        {t.description({
          invitedByUsername,
          invitedByEmail,
          orgName,
          role,
          platformName: BRAND.name,
        })}
      </Text>
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          className="bg-primary rounded text-primary-foreground text-[12px] font-semibold no-underline text-center px-5 py-3"
          href={inviteLink}
        >
          {t.joinButton(orgName)}
        </Button>
      </Section>
      <Text className="text-black text-[14px] leading-[24px]">
        {t.fallback}:{' '}
        <Link href={inviteLink} className="text-blue-600 no-underline">
          {inviteLink}
        </Link>
      </Text>
    </DefaultTemplate>
  )
}

OrgInvite.PreviewProps = {
  invitedByUsername: 'Alan',
  invitedByEmail: 'alan.turing@example.com',
  orgName: 'Enigma',
  inviteLink: 'https://vercel.com',
  role: 'admin',
  locale: 'de',
} satisfies OrgInviteProps

export default OrgInvite

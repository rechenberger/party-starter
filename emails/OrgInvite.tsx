import { getTranslations } from '@/i18n/getTranslations'
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
  locale,
}: OrgInviteProps) => {
  const t = await getTranslations(locale)
  const previewText = t.email.orgInvite.subjectText({
    orgName,
    platformName: BRAND.name,
  })
  return (
    <DefaultTemplate previewText={previewText} locale={locale}>
      <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
        {t.email.orgInvite.welcome(orgName)}
      </Heading>
      <Text className="text-black text-[14px] leading-[24px]">
        {t.email.orgInvite.greeting}
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        {t.email.orgInvite.description({
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
          {t.email.orgInvite.joinButton(orgName)}
        </Button>
      </Section>
      <Text className="text-black text-[14px] leading-[24px]">
        {t.email.orgInvite.fallback}:{' '}
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
  locale: DEFAULT_LOCALE,
} satisfies OrgInviteProps

export default OrgInvite

import { getTranslations } from '@/i18n/getTranslations'
import { DEFAULT_LOCALE, Locale } from '@/i18n/locale'
import { Button, Heading, Link, Section, Text } from '@react-email/components'
import { DefaultTemplate } from './DefaultTemplate'

type VerifyEmailProps = {
  verifyUrl: string
  locale: Locale
}

export const VerifyEmail = async ({ verifyUrl, locale }: VerifyEmailProps) => {
  const t = await getTranslations(locale)

  return (
    <DefaultTemplate
      previewText={t.email.verifyEmail.previewText}
      locale={locale}
    >
      <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
        {t.email.verifyEmail.title}
      </Heading>
      <Text className="text-black text-[14px] leading-[24px]">
        {t.email.verifyEmail.greeting}
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        {t.email.verifyEmail.description}
      </Text>
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          className="bg-primary text-primary-foreground rounded text-[12px] font-semibold no-underline text-center px-5 py-3"
          href={verifyUrl}
        >
          {t.email.verifyEmail.verifyButton}
        </Button>
      </Section>
      <Section className="mt-0">
        <Text className="text-black text-[14px] leading-[24px] mb-0">
          {t.email.verifyEmail.fallback}:
        </Text>
        <Text className="text-black text-[12px] leading-[16px] mt-0">
          <Link
            href={verifyUrl}
            className="text-blue-600 no-underline break-all"
          >
            {verifyUrl}
          </Link>
        </Text>
      </Section>
    </DefaultTemplate>
  )
}

VerifyEmail.PreviewProps = {
  locale: DEFAULT_LOCALE,
  verifyUrl:
    'http://localhost:3000/auth/verify-email?redirect=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fnodemailer%3FcallbackUrl%3Dhttp%253A%252F%252Flocalhost%253A3000%252Fauth%252Flogin%253Fredirect%253Dhttp%25253A%25252F%25252Flocalhost%25253A3000%25252Fusers%26token%3D15bb34f725b2aa439e89429480e2e41d8e788249b2d87fc0f9186daa78828bd8%26email%3Dweiskopf%252Btest%2540sodefa.de',
} satisfies VerifyEmailProps

export default VerifyEmail

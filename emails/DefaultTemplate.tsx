import { getTranslations } from '@/i18n/getTranslations'
import { DEFAULT_LOCALE, Locale } from '@/i18n/locale'
import { BRAND } from '@/lib/starter.config'
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

export const DefaultTemplate = async ({
  previewText,
  locale,
  children,
}: {
  previewText: string
  locale?: Locale
  children: React.ReactNode
}) => {
  const t = await getTranslations(locale)
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: BRAND.colors.primary,
                'primary-foreground': BRAND.colors.primaryForeground,
              },
            },
          },
        }}
      >
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Preview>{previewText}</Preview>
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={BRAND.logoUrl}
                width="40"
                height="37"
                alt={BRAND.name}
                className="my-0 mx-auto"
              />
            </Section>
            {children}
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              {t.email.defaultTemplate.footer.signature}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

DefaultTemplate.PreviewProps = {
  locale: DEFAULT_LOCALE,
  previewText: BRAND.name,
}

export default DefaultTemplate

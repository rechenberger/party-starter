import { createEmailTemplate } from '@/lib/createEmailTemplate'
import { BRAND } from '@/lib/starter.config'
import { Button, Heading, Link, Section, Text } from '@react-email/components'
import { z } from 'zod'
import { DefaultTemplate } from './DefaultTemplate'

export const verifyEmailEmail = createEmailTemplate({
  schema: z.object({
    verifyUrl: z.string(),
  }),
  previewProps: {
    verifyUrl:
      'http://localhost:3000/auth/verify-email?redirect=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fnodemailer%3FcallbackUrl%3Dhttp%253A%252F%252Flocalhost%253A3000%252Fauth%252Flogin%253Fredirect%253Dhttp%25253A%25252F%25252Flocalhost%25253A3000%25252Fusers%26token%3D15bb34f725b2aa439e89429480e2e41d8e788249b2d87fc0f9186daa78828bd8%26email%3Dweiskopf%252Btest%2540sodefa.de',
  },
  Email: async ({ props, locale, t }) => {
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
            href={props.verifyUrl}
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
              href={props.verifyUrl}
              className="text-blue-600 no-underline break-all"
            >
              {props.verifyUrl}
            </Link>
          </Text>
        </Section>
      </DefaultTemplate>
    )
  },
  subject: async ({ props, t }) => {
    return t.email.verifyEmail.subjectText({
      platformName: BRAND.name,
    })
  },
})

export default verifyEmailEmail.preview()

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

export const DefaultTemplate = ({
  previewText,
  children,
}: {
  previewText: string
  children: React.ReactNode
}) => {
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
              Best regards
              <br />
              {BRAND.emails.footer.signature}
              <br />
              🎉
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

DefaultTemplate.PreviewProps = {
  previewText: BRAND.name,
}

export default DefaultTemplate

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
                primary: '#79a913',
                'primary-foreground': '#fafaf9',
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
                src={`https://party-starter.vercel.app/logo.svg`}
                width="40"
                height="37"
                alt="Logo"
                className="my-0 mx-auto"
              />
            </Section>
            {children}
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Best regards
              <br />
              The Party Starter Team
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
  previewText: 'Party Starter',
}

export default DefaultTemplate

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { DefaultTemplate } from './DefaultTemplate'
interface VerifyEmailProps {
  verifyUrl: string
}

export const VerifyEmail = ({ verifyUrl }: VerifyEmailProps) => {
  const previewText = `Verify your email address`

  return (
    <DefaultTemplate previewText={previewText}>
      <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
        Verify your email address
      </Heading>
      <Text className="text-black text-[14px] leading-[24px]">Hello,</Text>
      <Text className="text-black text-[14px] leading-[24px]">
        Please verify your email address by clicking the link below:
      </Text>
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          className="bg-primary text-primary-foreground rounded text-[12px] font-semibold no-underline text-center px-5 py-3"
          href={verifyUrl}
        >
          👉 Verify 👈
        </Button>
      </Section>
      <Text className="text-black text-[14px] leading-[24px]">
        or copy and paste this URL into your browser:{' '}
        <Link href={verifyUrl} className="text-blue-600 no-underline break-all">
          {verifyUrl}
        </Link>
      </Text>
    </DefaultTemplate>
  )
}

VerifyEmail.PreviewProps = {
  verifyUrl:
    'http://localhost:3000/auth/verify-email?redirect=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fnodemailer%3FcallbackUrl%3Dhttp%253A%252F%252Flocalhost%253A3000%252Fauth%252Flogin%253Fredirect%253Dhttp%25253A%25252F%25252Flocalhost%25253A3000%25252Fusers%26token%3D15bb34f725b2aa439e89429480e2e41d8e788249b2d87fc0f9186daa78828bd8%26email%3Dweiskopf%252Btest%2540sodefa.de',
}

export default VerifyEmail

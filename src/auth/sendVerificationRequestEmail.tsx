import { getMailTransporter } from '@/lib/getMailTransporter'
import { BRAND } from '@/lib/starter.config'
import type { EmailConfig } from '@auth/core/providers/email'
import { VerifyEmail } from '@emails/VerifyEmail'
import { render } from '@react-email/components'

export const sendVerificationRequestEmail = async (
  params: Parameters<EmailConfig['sendVerificationRequest']>[0],
) => {
  const { identifier: email, url } = params
  try {
    const transporter = getMailTransporter()

    const emailHtml = await render(<VerifyEmail verifyUrl={url} />)
    const emailPlainText = await render(<VerifyEmail verifyUrl={url} />, {
      plainText: true,
    })

    const mailOptions = {
      to: email,
      subject: `Login to ${BRAND.name}`,
      html: emailHtml,
      text: emailPlainText,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log({ error })
  }
}

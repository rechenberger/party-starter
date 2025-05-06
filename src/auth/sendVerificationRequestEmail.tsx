import { BRAND } from '@/lib/starter.config'
import type { EmailConfig } from '@auth/core/providers/email'
import { VerifyEmail } from '@emails/VerifyEmail'
import { render } from '@react-email/components'
import nodemailer from 'nodemailer'

export const sendVerificationRequestEmail = async (
  params: Parameters<EmailConfig['sendVerificationRequest']>[0],
) => {
  const {
    identifier: email,
    url,
    provider: { from },
  } = params
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_URL,
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    })

    const host = new URL(url).host

    const emailHtml = await render(<VerifyEmail verifyUrl={url} />)
    const emailPlainText = await render(<VerifyEmail verifyUrl={url} />, {
      plainText: true,
    })

    const mailOptions = {
      from: from,
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

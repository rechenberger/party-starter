import type { EmailConfig } from '@auth/core/providers/email'
import { render } from '@react-email/components'
import nodemailer from 'nodemailer'
import { VerifyEmail } from '@emails/VerifyEmail'

export const sendVerificationRequestEmail = async (
  params: Parameters<EmailConfig['sendVerificationRequest']>[0],
) => {
  const {
    identifier: email,
    url,
    theme,
    provider: { from },
  } = params
  try {
    // Looking to send emails in production? Check out our Email API/SMTP product!
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
      subject: `Login to ${host}`,
      html: emailHtml,
      text: emailPlainText,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log({ error })
  }
}

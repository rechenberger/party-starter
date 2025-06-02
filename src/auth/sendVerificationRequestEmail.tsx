import { getMyLocale } from '@/i18n/getMyLocale'
import { getTranslations } from '@/i18n/getTranslations'
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
    const locale = await getMyLocale()
    const t = await getTranslations(locale)
    const emailComponent = <VerifyEmail verifyUrl={url} locale={locale} />

    const [html, text] = await Promise.all([
      render(emailComponent),
      render(emailComponent, {
        plainText: true,
      }),
    ])

    const mailOptions = {
      to: email,
      subject: t.email.verifyEmail.subjectText(BRAND.name),
      html,
      text,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log({ error })
  }
}

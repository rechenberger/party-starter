import { getEmailTranslations } from '@/i18n/getEmailTranslations'
import { getMyLocale } from '@/i18n/getMyLocale'
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
    const emailTranslations = await getEmailTranslations(locale)
    const emailComponent = <VerifyEmail verifyUrl={url} locale={locale} />
    const emailHtml = await render(emailComponent)
    const emailPlainText = await render(emailComponent, {
      plainText: true,
    })

    const mailOptions = {
      to: email,
      subject: emailTranslations.verifyEmail.subjectText(BRAND.name),
      html: emailHtml,
      text: emailPlainText,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log({ error })
  }
}

import { getTranslations } from '@/i18n/getTranslations'
import { Locale } from '@/i18n/locale'
import { t } from '@/i18n/translations/emailTranslations.en'
import { getMailTransporter } from '@/lib/getMailTransporter'
import { Prettify } from '@/lib/prettify'
import { OrgInvite } from '@emails/OrgInvite'
import { VerifyEmail } from '@emails/VerifyEmail'
import { render } from '@react-email/components'

type SendMailParams = Prettify<
  {
    receiverEmail: string
    locale?: Locale
  } & (
    | {
        template: 'orgInvite'
        props: Parameters<typeof OrgInvite>[0]
        subjectProps: Parameters<typeof t.orgInvite.subjectText>[0]
      }
    | {
        template: 'verifyEmail'
        props: Parameters<typeof VerifyEmail>[0]
        subjectProps: Parameters<typeof t.verifyEmail.subjectText>[0]
      }
  )
>

const getEmailComponent = (params: SendMailParams) => {
  const { template, props, locale } = params
  switch (template) {
    case 'orgInvite':
      return <OrgInvite {...props} locale={locale} />
    case 'verifyEmail':
      return <VerifyEmail {...props} locale={locale} />
  }
}

const getSubject = async (params: SendMailParams) => {
  const { template, subjectProps } = params
  const t = await getTranslations(params.locale)
  switch (template) {
    case 'orgInvite':
      return t.email.orgInvite.subjectText(subjectProps)
    case 'verifyEmail':
      return t.email.verifyEmail.subjectText(subjectProps)
  }
}

export const sendMail = async (params: SendMailParams) => {
  try {
    const emailComponent = getEmailComponent(params)
    const transporter = getMailTransporter()

    const subject = await getSubject(params)

    const [html, text] = await Promise.all([
      render(emailComponent),
      render(emailComponent, {
        plainText: true,
      }),
    ])

    const mailOptions = {
      to: params.receiverEmail,
      subject,
      html,
      text,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log({ error })
    throw error
  }
}

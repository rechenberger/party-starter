import { getMyLocale } from '@/i18n/getMyLocale'
import { getTranslations } from '@/i18n/getTranslations'
import { DEFAULT_LOCALE, Locale } from '@/i18n/locale'
import { TranslationsServerAndClient } from '@/i18n/translations/translations.server.en'
import { render } from '@react-email/components'
import { ReactNode } from 'react'
import { ZodType, z } from 'zod'
import { getMailTransporter } from './getMailTransporter'
import { typedParse } from './typedParse'

type EmailRenderProps<Schema extends ZodType> = {
  props: z.output<Schema>
  t: TranslationsServerAndClient
  locale: Locale
}

export const createEmailTemplate = <Schema extends ZodType>(template: {
  schema: Schema
  Email: (props: EmailRenderProps<Schema>) => Promise<ReactNode>
  subject: (props: EmailRenderProps<Schema>) => Promise<string>
  previewProps: z.input<Schema>
}) => {
  const send = async (params: {
    to: string
    locale?: Locale
    props: z.input<Schema>
  }) => {
    try {
      const locale = params.locale ?? (await getMyLocale())
      const t = await getTranslations({ locale })

      const props = typedParse(template.schema, params.props)
      const renderProps = { props, t, locale }

      const emailComponent = <template.Email {...renderProps} />

      const [html, text] = await Promise.all([
        render(emailComponent),
        render(emailComponent, {
          plainText: true,
        }),
      ])

      const subject = await template.subject(renderProps)

      const transporter = getMailTransporter()
      await transporter.sendMail({
        to: params.to,
        subject,
        html,
        text,
      })
    } catch (error) {
      console.error('Error sending email', error)
      throw error
    }
  }

  const preview = () => {
    const Email = async (props: z.input<Schema>) => {
      const locale = DEFAULT_LOCALE
      const t = await getTranslations({ locale })
      const parsedProps = typedParse(template.schema, props)
      return <template.Email props={parsedProps} t={t} locale={locale} />
    }
    Email.PreviewProps = template.previewProps
    return Email
  }

  return {
    send,
    template,
    preview,
  }
}

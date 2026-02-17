import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { getMyLocale } from '@/i18n/getMyLocale'
import { getTranslations } from '@/i18n/getTranslations'
import { DEFAULT_LOCALE, Locale } from '@/i18n/locale'
import { TranslationsServerAndClient } from '@/i18n/translations/translations.server.en'
import { render } from '@react-email/components'
import { eq } from 'drizzle-orm'
import { ReactNode } from 'react'
import { ZodType, z } from 'zod'
import { isEmailAllowlisted } from './email-allowlist'
import { getEmailFromAddress, shouldActuallySendEmails } from './email-delivery'
import { getMailTransporter } from './getMailTransporter'
import { typedParse } from './typedParse'

type EmailRenderProps<Schema extends ZodType> = {
  props: z.output<Schema>
  t: TranslationsServerAndClient
  locale: Locale
}

export const createEmailTemplate = <Schema extends ZodType>(template: {
  name: string
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
    let emailLogId: string | undefined

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

      const fromEmail = getEmailFromAddress()
      const runId = process.env.E2E_RUN_ID ?? null

      const [emailLog] = await db
        .insert(schema.emailLog)
        .values({
          template: template.name,
          provider: 'smtp',
          fromEmail,
          toEmail: params.to,
          subject,
          html,
          text,
          locale,
          status: 'queued',
          runId,
        })
        .returning({
          id: schema.emailLog.id,
        })

      emailLogId = emailLog?.id

      if (!shouldActuallySendEmails()) {
        const allowlisted = await isEmailAllowlisted(params.to)
        if (!allowlisted) {
          if (emailLogId) {
            await db
              .update(schema.emailLog)
              .set({
                status: 'skipped',
              })
              .where(eq(schema.emailLog.id, emailLogId))
          }
          return
        }
      }

      const transporter = getMailTransporter()
      await transporter.sendMail({
        from: fromEmail,
        to: params.to,
        subject,
        html,
        text,
      })

      if (emailLogId) {
        await db
          .update(schema.emailLog)
          .set({
            status: 'sent',
            sentAt: new Date(),
          })
          .where(eq(schema.emailLog.id, emailLogId))
      }
    } catch (error) {
      if (emailLogId) {
        await db
          .update(schema.emailLog)
          .set({
            status: 'failed',
            errorText:
              error instanceof Error
                ? `${error.name}: ${error.message}`
                : `${error}`,
          })
          .where(eq(schema.emailLog.id, emailLogId))
          .catch(() => undefined)
      }
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

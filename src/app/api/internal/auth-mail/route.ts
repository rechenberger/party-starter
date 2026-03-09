import { verifyEmailEmail } from '@/emails/VerifyEmail'
import { DEFAULT_LOCALE, Locale } from '@/i18n/locale'
import {
  getEmailFromAddress,
  shouldActuallySendEmails,
} from '@/lib/email-delivery'
import { createServerConvexClient } from '@/lib/convex'
import { getMailTransporter } from '@/lib/getMailTransporter'
import { render } from '@react-email/components'
import { NextResponse } from 'next/server'
import { createElement } from 'react'
import { z } from 'zod'

const payloadSchema = z.object({
  template: z.enum(['verify-email', 'reset-password']),
  to: z.string().email(),
  url: z.string().url(),
  locale: Locale.optional(),
})

export async function POST(request: Request) {
  const secret = request.headers.get('x-auth-secret')
  if (!process.env.AUTH_SECRET || secret !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = payloadSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { template, to, url } = parsed.data
  const locale = parsed.data.locale ?? DEFAULT_LOCALE
  const Email = verifyEmailEmail.preview()
  const html = await render(createElement(Email, { verifyUrl: url }))
  const text = await render(createElement(Email, { verifyUrl: url }), {
    plainText: true,
  })
  const subject =
    template === 'reset-password' ? 'Reset your password' : 'Verify your email'

  if (shouldActuallySendEmails()) {
    await getMailTransporter().sendMail({
      from: getEmailFromAddress(),
      to,
      subject,
      html,
      text,
    })
  }

  await createServerConvexClient().mutation('emails:capture' as any, {
    template: 'verify-email',
    provider: 'smtp',
    fromEmail: getEmailFromAddress(),
    toEmail: to,
    subject,
    html,
    text,
    locale,
    status: shouldActuallySendEmails() ? 'sent' : 'skipped',
    errorText: null,
    runId: process.env.E2E_RUN_ID ?? null,
  })

  return NextResponse.json({ ok: true })
}

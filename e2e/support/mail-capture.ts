import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { and, desc, eq, gte, ilike, inArray, type SQL } from 'drizzle-orm'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const waitForCapturedMail = async ({
  to,
  template,
  timeoutMs = 15_000,
  createdAfterMs = 0,
}: {
  to: string
  template: string
  timeoutMs?: number
  createdAfterMs?: number
}) => {
  const deadline = Date.now() + timeoutMs
  const createdAfterDate = new Date(createdAfterMs || 0)
  const runId = process.env.E2E_RUN_ID?.trim() || null

  while (Date.now() < deadline) {
    const conditions: SQL<unknown>[] = [
      eq(schema.emailLog.template, template),
      ilike(schema.emailLog.toEmail, to),
      gte(schema.emailLog.createdAt, createdAfterDate),
      inArray(schema.emailLog.status, ['queued', 'sent', 'skipped']),
      ...(runId ? [eq(schema.emailLog.runId, runId)] : []),
    ]

    const [match] = await db
      .select({
        template: schema.emailLog.template,
        to: schema.emailLog.toEmail,
        subject: schema.emailLog.subject,
        html: schema.emailLog.html,
        text: schema.emailLog.text,
        createdAt: schema.emailLog.createdAt,
        runId: schema.emailLog.runId,
      })
      .from(schema.emailLog)
      .where(and(...conditions))
      .orderBy(desc(schema.emailLog.createdAt))
      .limit(1)

    if (match) return match

    await sleep(500)
  }

  throw new Error(`No captured mail found for template=${template} to=${to}`)
}

const URL_REGEX = /https?:\/\/[^\s"')>]+/gi

const cleanUrl = (url: string) => {
  return url
    .replace(/&amp;/g, '&')
    .replace(/[),.;!?]+$/g, '')
    .trim()
}

export const extractFirstUrl = (input: string) => {
  const urls = input.match(URL_REGEX)
  if (!urls?.length) {
    throw new Error('No URL found in mail body')
  }
  return cleanUrl(urls[0])
}

export const extractJoinUrl = (input: string) => {
  const urls = input.match(URL_REGEX)
  const joinUrl = urls?.find((url) => url.toLowerCase().includes('/join/'))
  if (!joinUrl) {
    throw new Error('No join URL found in captured mail body')
  }
  return cleanUrl(joinUrl)
}

export const extractVerifyUrl = (input: string) => {
  const urls = input.match(URL_REGEX)
  const verifyUrl = urls?.find((url) => {
    const lower = url.toLowerCase()
    return (
      lower.includes('/api/auth/callback/nodemailer') ||
      lower.includes('/auth/verify-email')
    )
  })
  if (!verifyUrl) {
    throw new Error('No auth verify URL found in captured mail body')
  }
  return cleanUrl(verifyUrl)
}

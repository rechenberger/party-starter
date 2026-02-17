import { neon } from '@neondatabase/serverless'

type CapturedMail = {
  template: string
  to: string
  subject: string
  html: string
  text: string
  createdAt: string
  runId: string | null
}

type CapturedMailRow = {
  template: string
  to: string
  subject: string
  html: string
  text: string
  createdAt: string
  runId: string | null
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const getMailQueryClient = () => {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for DB-backed mail capture.')
  }
  return neon(databaseUrl)
}

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
  const sql = getMailQueryClient()
  const deadline = Date.now() + timeoutMs
  const createdAfterDate = new Date(createdAfterMs || 0)
  const runId = process.env.E2E_RUN_ID?.trim() || null

  while (Date.now() < deadline) {
    const rows =
      runId !== null
        ? ((await sql`
            select
              template,
              to_email as "to",
              subject,
              html,
              text,
              "createdAt" as "createdAt",
              run_id as "runId"
            from email_log
            where template = ${template}
              and lower(to_email) = lower(${to})
              and "createdAt" >= ${createdAfterDate}
              and run_id = ${runId}
              and status in ('queued', 'sent', 'skipped')
            order by "createdAt" desc
            limit 1
          `) as CapturedMailRow[])
        : ((await sql`
            select
              template,
              to_email as "to",
              subject,
              html,
              text,
              "createdAt" as "createdAt",
              run_id as "runId"
            from email_log
            where template = ${template}
              and lower(to_email) = lower(${to})
              and "createdAt" >= ${createdAfterDate}
              and status in ('queued', 'sent', 'skipped')
            order by "createdAt" desc
            limit 1
          `) as CapturedMailRow[])

    const latestMatch = rows[0]
    if (latestMatch) return latestMatch as CapturedMail

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

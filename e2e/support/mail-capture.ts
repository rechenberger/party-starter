import { createServerConvexClient } from '@/lib/convex'

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
  const runId = process.env.E2E_RUN_ID?.trim() || null
  const convex = createServerConvexClient()

  while (Date.now() < deadline) {
    const match = await convex.query('emails:findCapturedMail' as any, {
      to,
      template,
      createdAfterMs,
      runId,
    })

    if (match) {
      return match as {
        template: string
        toEmail: string
        subject: string
        html: string
        text: string
        createdAt: number
        runId?: string | null
      }
    }

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
      lower.includes('/api/auth/') || lower.includes('/auth/change-password')
    )
  })
  if (!verifyUrl) {
    throw new Error('No auth verify URL found in captured mail body')
  }
  return cleanUrl(verifyUrl)
}

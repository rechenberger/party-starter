import fs from 'node:fs/promises'
import path from 'node:path'

type CapturedMail = {
  template: string
  to: string
  subject: string
  html: string
  text: string
  createdAt: string
  runId: string | null
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const getMailCaptureDir = () => {
  const dir = process.env.E2E_MAIL_CAPTURE_DIR
  if (!dir) {
    throw new Error(
      'E2E_MAIL_CAPTURE_DIR is not set. Enable capture by setting this environment variable.',
    )
  }
  return path.resolve(process.cwd(), dir)
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
  const dir = getMailCaptureDir()
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    const fileNames = await fs.readdir(dir).catch(() => [])
    let latestMatch: CapturedMail | undefined
    let latestMatchCreatedAt = 0

    for (const fileName of fileNames) {
      if (!fileName.endsWith('.json')) {
        continue
      }

      const fullPath = path.join(dir, fileName)
      const raw = await fs.readFile(fullPath, 'utf8').catch(() => null)
      if (!raw) {
        continue
      }

      let parsed: CapturedMail
      try {
        parsed = JSON.parse(raw) as CapturedMail
      } catch {
        continue
      }
      const createdAtMs = Number.isNaN(Date.parse(parsed.createdAt))
        ? 0
        : Date.parse(parsed.createdAt)
      if (
        parsed.template === template &&
        parsed.to.toLowerCase() === to.toLowerCase() &&
        createdAtMs >= createdAfterMs
      ) {
        if (!latestMatch || createdAtMs >= latestMatchCreatedAt) {
          latestMatch = parsed
          latestMatchCreatedAt = createdAtMs
        }
      }
    }

    if (latestMatch) {
      return latestMatch
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
      lower.includes('/api/auth/callback/nodemailer') ||
      lower.includes('/auth/verify-email')
    )
  })
  if (!verifyUrl) {
    throw new Error('No auth verify URL found in captured mail body')
  }
  return cleanUrl(verifyUrl)
}

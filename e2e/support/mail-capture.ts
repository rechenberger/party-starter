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
}: {
  to: string
  template: string
  timeoutMs?: number
}) => {
  const dir = getMailCaptureDir()
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    const fileNames = await fs.readdir(dir).catch(() => [])

    for (const fileName of fileNames) {
      if (!fileName.endsWith('.json')) {
        continue
      }

      const fullPath = path.join(dir, fileName)
      const raw = await fs.readFile(fullPath, 'utf8').catch(() => null)
      if (!raw) {
        continue
      }

      const parsed = JSON.parse(raw) as CapturedMail
      if (
        parsed.template === template &&
        parsed.to.toLowerCase() === to.toLowerCase()
      ) {
        return parsed
      }
    }

    await sleep(500)
  }

  throw new Error(`No captured mail found for template=${template} to=${to}`)
}

export const extractJoinUrl = (input: string) => {
  const match = input.match(/https?:\/\/[^\s"')>]+\/join\/[^\s"')>]+/i)
  if (!match) {
    throw new Error('No join URL found in captured mail body')
  }
  return match[0]
}

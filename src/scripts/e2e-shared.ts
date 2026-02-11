import { spawn } from 'node:child_process'
import os from 'node:os'

const DEFAULT_MAX_WORKERS = 6

export function getWorkerCount() {
  const fromEnv = Number(process.env.E2E_WORKERS)
  if (Number.isInteger(fromEnv) && fromEnv > 0) {
    return fromEnv
  }
  return Math.max(1, Math.min(os.cpus().length, DEFAULT_MAX_WORKERS))
}

export function spawnAndWait(
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      env,
    })

    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }
      reject(
        new Error(
          `${command} ${args.join(' ')} failed with ${
            signal ? `signal ${signal}` : `exit code ${code}`
          }`,
        ),
      )
    })
  })
}

export function findConnectionString(input: unknown): string | undefined {
  if (typeof input === 'string' && /^postgres(ql)?:\/\//i.test(input)) {
    return input
  }

  if (Array.isArray(input)) {
    for (const value of input) {
      const match = findConnectionString(value)
      if (match) return match
    }
    return undefined
  }

  if (!input || typeof input !== 'object') return undefined

  const record = input as Record<string, unknown>
  const preferredKeys = ['connectionString', 'connection_string', 'uri', 'url']
  for (const key of preferredKeys) {
    const value = record[key]
    const match = findConnectionString(value)
    if (match) return match
  }
  for (const value of Object.values(record)) {
    const match = findConnectionString(value)
    if (match) return match
  }
  return undefined
}

export function extractConnectionString(
  stdout: string,
  stderr?: string,
): string {
  const output = [stdout, stderr].filter(Boolean).join('\n')

  try {
    const parsed = JSON.parse(stdout || '{}')
    const fromJson = findConnectionString(parsed)
    if (fromJson) return fromJson
  } catch {
    // fall back to regex extraction
  }

  const regexMatch = output.match(/postgres(?:ql)?:\/\/[^\s"'`]+/i)
  if (regexMatch) return regexMatch[0]

  throw new Error('Could not parse connection string from neonctl output')
}

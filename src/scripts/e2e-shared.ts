import os from 'node:os'

const DEFAULT_MAX_WORKERS = 6

export function getWorkerCount() {
  const fromEnv = Number(process.env.E2E_WORKERS)
  if (Number.isInteger(fromEnv) && fromEnv > 0) {
    return fromEnv
  }
  return Math.max(1, Math.min(os.cpus().length, DEFAULT_MAX_WORKERS))
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

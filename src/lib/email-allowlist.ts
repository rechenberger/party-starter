import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { count } from 'drizzle-orm'

const globMatch = (pattern: string, value: string): boolean => {
  const parts = pattern.toLowerCase().split('*')
  const val = value.toLowerCase()

  if (parts.length === 1) return val === parts[0]

  let pos = 0
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (i === 0) {
      if (!val.startsWith(part)) return false
      pos = part.length
    } else if (i === parts.length - 1) {
      if (!val.endsWith(part)) return false
      if (val.length - part.length < pos) return false
    } else {
      const idx = val.indexOf(part, pos)
      if (idx === -1) return false
      pos = idx + part.length
    }
  }
  return true
}

export const isEmailAllowlisted = async (email: string): Promise<boolean> => {
  const entries = await db
    .select({ pattern: schema.emailAllowlist.pattern })
    .from(schema.emailAllowlist)

  return entries.some((entry) => globMatch(entry.pattern, email))
}

export const getAllowlistCount = async (): Promise<number> => {
  const [result] = await db
    .select({ count: count() })
    .from(schema.emailAllowlist)
  return result?.count ?? 0
}

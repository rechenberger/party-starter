import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { count } from 'drizzle-orm'

const globToRegex = (pattern: string): RegExp => {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&')
  const withWildcards = escaped.replace(/\*/g, '.*')
  return new RegExp(`^${withWildcards}$`, 'i')
}

export const isEmailAllowlisted = async (email: string): Promise<boolean> => {
  const entries = await db
    .select({ pattern: schema.emailAllowlist.pattern })
    .from(schema.emailAllowlist)

  return entries.some((entry) => globToRegex(entry.pattern).test(email))
}

export const getAllowlistCount = async (): Promise<number> => {
  const [result] = await db
    .select({ count: count() })
    .from(schema.emailAllowlist)
  return result?.count ?? 0
}

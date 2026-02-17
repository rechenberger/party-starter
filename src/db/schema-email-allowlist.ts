import { pgTable, text } from 'drizzle-orm/pg-core'
import { createdUpdatedAtColumns, idColumn } from './commonColumns'

export const emailAllowlist = pgTable('email_allowlist', {
  id: idColumn(),
  ...createdUpdatedAtColumns(),
  pattern: text('pattern').notNull().unique(),
})

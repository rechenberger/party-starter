import { relations, sql } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { z } from 'zod'
import { createdUpdatedAtByColumns, idColumn } from './commonColumns'
import { zodEnumToCustomType } from './zodEnumToCustomType'

export const CronStatus = z.enum(['running', 'success', 'error'])
export type CronStatus = z.infer<typeof CronStatus>

export const cronRun = pgTable('cron_run', {
  id: idColumn(),
  ...createdUpdatedAtByColumns(),
  cronName: text('cron_name').notNull(),
  status: zodEnumToCustomType(CronStatus)('status')
    .notNull()
    .default('running'),
  statusText: text('status_text'),
  endedAt: timestamp('ended_at', { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  heartbeat: timestamp('heartbeat', { withTimezone: true }),
})

export const cronRunRelations = relations(cronRun, () => ({}))

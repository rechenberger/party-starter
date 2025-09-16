import { relations, sql } from 'drizzle-orm'
import { customType, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { z } from 'zod'
import { createdUpdatedAtByColumns, idColumn } from './commonColumns'

export const CronStatus = z.enum(['running', 'success', 'error'])
export type CronStatus = z.infer<typeof CronStatus>

const cronStatusType = customType<{
  data: CronStatus
  driverData: string
}>({
  dataType() {
    return 'text'
  },
  toDriver(value: CronStatus): string {
    return CronStatus.parse(value)
  },
  fromDriver(value: string): CronStatus {
    return CronStatus.parse(value)
  },
})

export const cronRun = pgTable('cron_run', {
  id: idColumn(),
  ...createdUpdatedAtByColumns(),
  cronName: text('cron_name').notNull(),
  status: cronStatusType('status').notNull().default('running'),
  statusText: text('status_text'),
  endedAt: timestamp('ended_at', { withTimezone: true }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  heartbeat: timestamp('heartbeat', { withTimezone: true }),
})

export const cronRunRelations = relations(cronRun, () => ({}))

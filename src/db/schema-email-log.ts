import { relations } from 'drizzle-orm'
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { z } from 'zod'
import { createdUpdatedAtColumns, idColumn } from './commonColumns'
import { zodEnumToCustomType } from './zodEnumToCustomType'

export const EmailLogStatus = z.enum(['queued', 'sent', 'skipped', 'failed'])
export type EmailLogStatus = z.infer<typeof EmailLogStatus>

export const emailLog = pgTable(
  'email_log',
  {
    id: idColumn(),
    ...createdUpdatedAtColumns(),

    template: text('template').notNull(),
    provider: text('provider').notNull(),
    fromEmail: text('from_email').notNull(),
    toEmail: text('to_email').notNull(),
    subject: text('subject').notNull(),
    html: text('html').notNull(),
    text: text('text').notNull(),
    locale: text('locale').notNull(),
    status: zodEnumToCustomType(EmailLogStatus)('status')
      .notNull()
      .default('queued'),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    errorText: text('error_text'),
    runId: text('run_id'),
  },
  (t) => [
    index('emailLog_createdAt_idx').on(t.createdAt),
    index('emailLog_template_toEmail_createdAt_idx').on(
      t.template,
      t.toEmail,
      t.createdAt,
    ),
    index('emailLog_runId_createdAt_idx').on(t.runId, t.createdAt),
    index('emailLog_status_createdAt_idx').on(t.status, t.createdAt),
  ],
)

export const emailLogRelations = relations(emailLog, () => ({}))

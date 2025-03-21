import type { AdapterAccount } from '@auth/core/adapters'
import { relations } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const legacyUsers = sqliteTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  isAdmin: integer('isAdmin', { mode: 'boolean' }),
  passwordHash: text('passwordHash'),
})

export const legacyUsersRelations = relations(legacyUsers, ({ many }) => ({
  accounts: many(legacyAccounts),
}))

export const legacyAccounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => legacyUsers.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const legacyAccountsRelations = relations(legacyAccounts, ({ one }) => ({
  user: one(legacyUsers, {
    fields: [legacyAccounts.userId],
    references: [legacyUsers.id],
  }),
}))

export const legacySessions = sqliteTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => legacyUsers.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
})

export const legacyVerificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)

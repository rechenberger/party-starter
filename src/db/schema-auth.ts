import { relations } from 'drizzle-orm'
import {
  boolean,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { createdUpdatedAtColumns, idColumn } from './commonColumns'

export type SelectUser = typeof users.$inferSelect

export const users = pgTable('user', {
  id: idColumn(),
  ...createdUpdatedAtColumns(),

  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),

  // better-auth admin plugin fields
  role: text('role').default('user'),
  banned: boolean('banned').default(false),
  banReason: text('banReason'),
  banExpires: timestamp('banExpires', { mode: 'date' }),
})

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}))

export const accounts = pgTable('account', {
  id: idColumn(),
  ...createdUpdatedAtColumns(),

  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt', { mode: 'date' }),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', { mode: 'date' }),
  scope: text('scope'),
  idToken: text('idToken'),
  password: text('password'),
})

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessions = pgTable('session', {
  id: idColumn(),
  ...createdUpdatedAtColumns(),

  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),

  // better-auth admin plugin field
  impersonatedBy: text('impersonatedBy'),
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const verifications = pgTable('verification', {
  id: idColumn(),
  ...createdUpdatedAtColumns(),

  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
})

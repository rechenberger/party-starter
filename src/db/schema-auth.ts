import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { createdUpdatedAtColumns, idColumn } from './commonColumns'

export const user = pgTable(
  'user',
  {
    id: idColumn(),
    ...createdUpdatedAtColumns(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    emailVerifiedAt: timestamp('emailVerified', { mode: 'date' }),
    emailVerified: boolean('emailVerifiedState').notNull().default(false),
    image: text('image'),
    isAdmin: boolean('isAdmin').notNull().default(false),
    passwordHash: text('passwordHash'),
    role: text('role').notNull().default('user'),
    banned: boolean('banned').notNull().default(false),
    banReason: text('banReason'),
    banExpires: timestamp('banExpires', {
      withTimezone: true,
      mode: 'date',
    }),
  },
  (table) => [uniqueIndex('user_email_unique').on(table.email)],
)

export const users = user

export const usersRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
}))

export const account = pgTable(
  'account',
  {
    id: idColumn(),
    ...createdUpdatedAtColumns(),
    accountId: text('providerAccountId').notNull(),
    providerId: text('provider').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type'),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    legacyExpiresAt: integer('expires_at'),
    tokenType: text('token_type'),
    sessionState: text('session_state'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt', {
      withTimezone: true,
      mode: 'date',
    }),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', {
      withTimezone: true,
      mode: 'date',
    }),
    scope: text('scope'),
    password: text('password'),
  },
  (table) => [
    uniqueIndex('account_provider_account_unique').on(
      table.providerId,
      table.accountId,
    ),
    index('account_user_id_idx').on(table.userId),
  ],
)

export const accounts = account

export const accountsRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const session = pgTable(
  'session',
  {
    id: idColumn(),
    ...createdUpdatedAtColumns(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    token: text('sessionToken').notNull(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    impersonatedBy: text('impersonatedBy'),
  },
  (table) => [
    uniqueIndex('session_token_unique').on(table.token),
    index('session_user_id_idx').on(table.userId),
  ],
)

export const sessions = session

export const sessionsRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const verification = pgTable(
  'verificationToken',
  {
    id: idColumn(),
    ...createdUpdatedAtColumns(),
    identifier: text('identifier').notNull(),
    value: text('token').notNull(),
    expiresAt: timestamp('expires', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
  },
  (table) => [
    uniqueIndex('verification_identifier_value_unique').on(
      table.identifier,
      table.value,
    ),
    index('verification_identifier_idx').on(table.identifier),
  ],
)

export const verifications = verification
export const verificationTokens = verification

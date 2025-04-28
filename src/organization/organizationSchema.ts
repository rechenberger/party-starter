import { createdAtColumn, idColumn, updatedAtColumn } from '@/db/commonColumns'
import { users } from '@/db/schema-auth'
import { relations } from 'drizzle-orm'
import {
  customType,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const OrganizationRole = z.enum(['admin', 'member'])
export type OrganizationRole = z.infer<typeof OrganizationRole>

const organizationRoleType = customType<{
  data: OrganizationRole
  driverData: string
}>({
  dataType() {
    return 'text'
  },
  toDriver(value: OrganizationRole): string {
    return OrganizationRole.parse(value)
  },
  fromDriver(value: string): OrganizationRole {
    return OrganizationRole.parse(value)
  },
})

export const organizationsTable = pgTable('organization', {
  id: idColumn(),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),

  name: text('name').notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
})

export const organizationsRelations = relations(
  organizationsTable,
  ({ many }) => ({
    memberships: many(organizationMembershipsTable),
    inviteCodes: many(inviteCodesTable),
  }),
)

export const inviteCodesTable = pgTable('invite_code', {
  id: idColumn(),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
  deletedAt: timestamp('deletedAt'),

  organizationId: text('organizationId')
    .notNull()
    .references(() => organizationsTable.id, { onDelete: 'cascade' }),
  createdById: text('createdById')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: organizationRoleType('role').notNull(),
  comment: text('comment'),
  expiresAt: timestamp('expiresAt'),
  maxUses: integer('maxUses'),
  currentUses: integer('currentUses'),
})

export const inviteCodesRelations = relations(
  inviteCodesTable,
  ({ one, many }) => ({
    organization: one(organizationsTable, {
      fields: [inviteCodesTable.organizationId],
      references: [organizationsTable.id],
    }),
    createdBy: one(users, {
      fields: [inviteCodesTable.createdById],
      references: [users.id],
    }),
    memberships: many(organizationMembershipsTable),
  }),
)

export const organizationMembershipsTable = pgTable('organization_membership', {
  id: idColumn(),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),

  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text('organizationId')
    .notNull()
    .references(() => organizationsTable.id, { onDelete: 'cascade' }),
  role: organizationRoleType('role').notNull(),
  invitationCodeId: text('invitationCodeId').references(
    () => inviteCodesTable.id,
    { onDelete: 'cascade' },
  ),
})

export const organizationMembershipsRelations = relations(
  organizationMembershipsTable,
  ({ one }) => ({
    user: one(users, {
      fields: [organizationMembershipsTable.userId],
      references: [users.id],
    }),
    organization: one(organizationsTable, {
      fields: [organizationMembershipsTable.organizationId],
      references: [organizationsTable.id],
    }),
    invitationCode: one(inviteCodesTable, {
      fields: [organizationMembershipsTable.invitationCodeId],
      references: [inviteCodesTable.id],
    }),
  }),
)

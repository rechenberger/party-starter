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

export const organizations = pgTable('organization', {
  id: idColumn(),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),

  name: text('name').notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
})

export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(organizationMemberships),
  inviteCodes: many(inviteCodes),
}))

export const inviteCodes = pgTable('invite_code', {
  id: idColumn(),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
  deletedAt: timestamp('deletedAt'),

  organizationId: text('organizationId')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  createdById: text('createdById').references(() => users.id, {
    onDelete: 'set null',
  }),
  role: organizationRoleType('role').notNull(),
  comment: text('comment'),
  expiresAt: timestamp('expiresAt'),
  maxUses: integer('maxUses'),
  currentUses: integer('currentUses'),
})

export const inviteCodesRelations = relations(inviteCodes, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [inviteCodes.organizationId],
    references: [organizations.id],
  }),
  createdBy: one(users, {
    fields: [inviteCodes.createdById],
    references: [users.id],
  }),
  memberships: many(organizationMemberships),
}))

export const organizationMemberships = pgTable('organization_membership', {
  id: idColumn(),
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),

  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  organizationId: text('organizationId')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  role: organizationRoleType('role').notNull(),
  invitationCodeId: text('invitationCodeId').references(() => inviteCodes.id, {
    onDelete: 'cascade',
  }),
})

export const organizationMembershipsRelations = relations(
  organizationMemberships,
  ({ one }) => ({
    user: one(users, {
      fields: [organizationMemberships.userId],
      references: [users.id],
    }),
    organization: one(organizations, {
      fields: [organizationMemberships.organizationId],
      references: [organizations.id],
    }),
    invitationCode: one(inviteCodes, {
      fields: [organizationMemberships.invitationCodeId],
      references: [inviteCodes.id],
    }),
  }),
)

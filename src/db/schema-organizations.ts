import { createdUpdatedAtByColumns, idColumn } from '@/db/commonColumns'
import { users } from '@/db/schema-auth'
import { OrganizationRole } from '@/organization/organizationRoles'

import { relations } from 'drizzle-orm'
import {
  customType,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

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
  ...createdUpdatedAtByColumns(),

  name: text('name').notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
})

export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(organizationMemberships),
  inviteCodes: many(inviteCodes),
}))

export const inviteCodes = pgTable(
  'invite_code',
  {
    id: idColumn(),
    ...createdUpdatedAtByColumns(),

    deletedAt: timestamp('deletedAt'),

    organizationId: text('organizationId')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),

    role: organizationRoleType('role').notNull(),
    comment: text('comment'),
    expiresAt: timestamp('expiresAt', { withTimezone: true }),
    usesMax: integer('usesMax'),
    usesCurrent: integer('usesCurrent'),
    sentToEmail: text('sentToEmail'),
  },
  (t) => [
    index('inviteCodes_organizationId_idx').on(t.organizationId),
    index('inviteCodes_deletedAt_idx').on(t.deletedAt.nullsFirst()),
  ],
)

export const inviteCodesRelations = relations(inviteCodes, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [inviteCodes.organizationId],
    references: [organizations.id],
  }),
  createdBy: one(users, {
    fields: [inviteCodes.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [inviteCodes.updatedById],
    references: [users.id],
  }),
  memberships: many(organizationMemberships),
}))

export const organizationMemberships = pgTable(
  'organization_membership',
  {
    id: idColumn(),
    ...createdUpdatedAtByColumns(),

    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organizationId: text('organizationId')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    role: organizationRoleType('role').notNull(),
    invitationCodeId: text('invitationCodeId').references(
      () => inviteCodes.id,
      {
        onDelete: 'restrict',
      },
    ),
  },
  (t) => [
    index('organizationMemberships_organizationId_idx').on(t.organizationId),
    index('organizationMemberships_userId_idx').on(t.userId),
  ],
)

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

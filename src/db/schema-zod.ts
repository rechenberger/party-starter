import { OrganizationRole } from '@/organization/organizationRoles'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'
import { schema } from './schema-export'

export const User = createSelectSchema(schema.users, {})
export type User = z.infer<typeof User>
export const UserInsert = createInsertSchema(schema.users, {})
export type UserInsert = z.infer<typeof UserInsert>

export const Organization = createSelectSchema(schema.organizations, {})
export type Organization = z.infer<typeof Organization>
export const OrganizationInsert = createInsertSchema(schema.organizations, {})
export type OrganizationInsert = z.infer<typeof OrganizationInsert>

export const InviteCode = createSelectSchema(schema.inviteCodes, {
  role: OrganizationRole,
})
export type InviteCode = z.infer<typeof InviteCode>
export const InviteCodeInsert = createInsertSchema(schema.inviteCodes, {
  role: OrganizationRole,
})
export type InviteCodeInsert = z.infer<typeof InviteCodeInsert>

export const OrganizationMembership = createSelectSchema(
  schema.organizationMemberships,
  {
    role: OrganizationRole,
  },
)
export type OrganizationMembership = z.infer<typeof OrganizationMembership>
export const OrganizationMembershipInsert = createInsertSchema(
  schema.organizationMemberships,
  {
    role: OrganizationRole,
  },
)
export type OrganizationMembershipInsert = z.infer<
  typeof OrganizationMembershipInsert
>

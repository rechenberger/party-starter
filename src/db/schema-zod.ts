import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import z from 'zod'
import { schema } from './schema-export'

export const User = createSelectSchema(schema.users, {})
export type User = z.infer<typeof User>
export const UserInsert = createInsertSchema(schema.users, {})
export type UserInsert = z.infer<typeof UserInsert>

export const InviteCode = createSelectSchema(schema.inviteCodes, {})
export type InviteCode = z.infer<typeof InviteCode>
export const InviteCodeInsert = createInsertSchema(schema.inviteCodes, {})
export type InviteCodeInsert = z.infer<typeof InviteCodeInsert>

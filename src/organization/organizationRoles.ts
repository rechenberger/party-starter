import { map } from 'remeda'
import { z } from 'zod'

export const OrganizationRoleDefinitions = [
  {
    name: 'admin',
    label: 'Admin',
  },
  {
    name: 'member',
    label: 'Member',
  },
] as const

const OrganizationRoles = map(OrganizationRoleDefinitions, (role) => role.name)

export const OrganizationRole = z.enum(OrganizationRoles)
export type OrganizationRole = z.infer<typeof OrganizationRole>

export const getOrganizationRole = (role: OrganizationRole) => {
  const definition = OrganizationRoleDefinitions.find((r) => r.name === role)
  if (!definition) {
    throw new Error(`Organization role ${role} not found`)
  }
  return definition
}

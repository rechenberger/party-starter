import { map } from 'remeda'
import { z } from 'zod'

export const organizationRoleDefinitions = [
  {
    name: 'admin',
    i18nKey: 'admin',
  },
  {
    name: 'member',
    i18nKey: 'member',
  },
] as const

const organizationRoles = map(organizationRoleDefinitions, (role) => role.name)

export const OrganizationRole = z.enum(organizationRoles)
export type OrganizationRole = z.infer<typeof OrganizationRole>

export const getOrganizationRole = (role: OrganizationRole) => {
  const definition = organizationRoleDefinitions.find((r) => r.name === role)
  if (!definition) {
    throw new Error(`Organization role ${role} not found`)
  }
  return definition
}

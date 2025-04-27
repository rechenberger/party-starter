import { canUserCreateOrg } from '@/organization/canUserCreateOrg'
import { getMyMemberships } from '@/organization/getMyMemberships'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'
import SeededAvatar from '../SeededAvatar'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '../ui/sidebar'

export const SidebarMainSection = async () => {
  const [memberships, userCanCreateOrg] = await Promise.all([
    getMyMemberships(),
    canUserCreateOrg(),
  ])

  if (memberships.length === 0) {
    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Organizations</SidebarGroupLabel>
      <SidebarMenu>
        {memberships.map((membership) => (
          <Fragment key={membership.organization.id}>
            <SidebarMenuButton tooltip={membership.organization.name} asChild>
              <Link href={`/org/${membership.organization.slug}`}>
                <SeededAvatar size={20} value={membership.organization.slug} />
                <span>{membership.organization.name}</span>
              </Link>
            </SidebarMenuButton>
          </Fragment>
        ))}
        {userCanCreateOrg && (
          <SidebarMenuButton tooltip="Create Organization" asChild>
            <Link href={`/create-org`}>
              <Plus size={20} />
              <span>Create Organization</span>
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}

import { getMyMemberships } from '@/organization/getMyMembershipts'
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
  const memberships = await getMyMemberships()

  if (memberships.length === 0) {
    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Organizations</SidebarGroupLabel>
      <SidebarMenu>
        {memberships.map((membership) => (
          <Fragment key={membership.organization.id}>
            <SidebarMenuButton tooltip={membership.organization.id} asChild>
              <Link href={`/org/${membership.organization.slug}`}>
                <SeededAvatar size={20} value={membership.organization.slug} />
                <span>{membership.organization.name}</span>
              </Link>
            </SidebarMenuButton>
          </Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

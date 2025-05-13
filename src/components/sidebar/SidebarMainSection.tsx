import { ORGS } from '@/lib/starter.config'
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

  return (
    <>
      {ORGS.isActive && (
        <SidebarGroup>
          <SidebarGroupLabel>Organizations</SidebarGroupLabel>
          <SidebarMenu>
            {memberships.map((membership) => (
              <Fragment key={membership.organization.id}>
                <SidebarMenuButton
                  size="lg"
                  tooltip={membership.organization.name}
                  asChild
                >
                  <Link href={`/org/${membership.organization.slug}`}>
                    <SeededAvatar
                      size={32}
                      value={membership.organization.slug}
                    />
                    <span>{membership.organization.name}</span>
                  </Link>
                </SidebarMenuButton>
              </Fragment>
            ))}
            {userCanCreateOrg && (
              <SidebarMenuButton tooltip="Create Organization" asChild>
                <Link href={`/org/create`}>
                  <Plus size={20} />
                  <span>Create Organization</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  )
}

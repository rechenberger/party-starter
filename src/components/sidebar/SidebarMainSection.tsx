import { getIsLoggedIn } from '@/auth/getMyUser'
import { ORGS } from '@/lib/starter.config'
import { canUserCreateOrg } from '@/organization/canUserCreateOrg'
import { getMyMemberships } from '@/organization/getMyMemberships'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'
import { getNavEntries } from '../layout/MainTop'
import SeededAvatar from '../SeededAvatar'
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '../ui/sidebar'
import { SidebarNavEntry } from './SidebarNavEntry'

export const SidebarMainSection = async () => {
  const [isLoggedIn, memberships, userCanCreateOrg] = await Promise.all([
    getIsLoggedIn(),
    getMyMemberships(),
    canUserCreateOrg(),
  ])

  let entries = await getNavEntries()
  entries = entries.filter((entry) => !entry.hideInSidebar)
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarMenu>
          {entries.map((entry) => (
            <Fragment key={entry.href}>
              <SidebarMenuButton tooltip={entry.name}>
                <SidebarNavEntry entry={entry} />
              </SidebarMenuButton>
            </Fragment>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      {ORGS.isActive && isLoggedIn && (
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
            {memberships.length === 0 && (
              <SidebarMenuButton tooltip="Create Organization" asChild>
                <Link href={`/org/create`}>
                  <Plus size={20} />
                  <span>Create Organization</span>
                </Link>
              </SidebarMenuButton>
            )}
            {userCanCreateOrg && memberships.length > 0 && (
              <SidebarGroupAction title="Create Organization">
                <Link href={`/org/create`}>
                  <Plus className="size-4" />
                </Link>
              </SidebarGroupAction>
            )}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  )
}

import { ChevronsUpDown, Globe, Plus } from 'lucide-react'

import { getMyUser } from '@/auth/getMyUser'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { db } from '@/db/db'
import { organizationMembershipsTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { ResponsiveDropdownMenuContent } from './ResponsiveDropdownMenuContent'
import SeededAvatar from './seeded-avatar'

export const OrgSwitcher = async ({ orgSlug }: { orgSlug?: string }) => {
  // TODO: Maybe extract this into getMyMemberships()
  const user = await getMyUser()
  if (!user) {
    return null
  }

  // TODO: Rename Table Stuff: No Table at the end
  const memberships = await db.query.organizationMembershipsTable.findMany({
    where: eq(organizationMembershipsTable.userId, user.id),
    with: {
      organization: true,
    },
  })

  let selectedMembership = memberships.find(
    (membership) => membership.organization.slug === orgSlug,
  )

  const membershipData = {
    orgName: selectedMembership?.organization.name ?? 'GLOBAL',
    orgSlug: selectedMembership?.organization.slug ?? 'global',
    isGlobal: !selectedMembership,
  }

  if (!selectedMembership) {
    selectedMembership = {
      organization: {
        name: 'GLOBAL',
        id: 'global',
        slug: 'global',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id: 'global',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      organizationId: 'global',
      role: 'member',
      invitationCodeId: null,
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                {membershipData.isGlobal ? (
                  <Globe className="size-5" />
                ) : (
                  <SeededAvatar
                    size={32}
                    style="shape"
                    value={membershipData.orgSlug}
                  />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {membershipData.orgName}
                </span>
                {/* <span className="truncate text-xs">{'activeTeam.plan'}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <ResponsiveDropdownMenuContent
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>
            {memberships.map((membership, index) => (
              <DropdownMenuItem
                key={membership.organization.id}
                // onClick={() => setActiveTeam(memberships)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <SeededAvatar
                    size={20}
                    style="shape"
                    value={membership.organization.slug}
                  />
                </div>
                {membership.organization.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </ResponsiveDropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

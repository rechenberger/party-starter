import { ChevronsUpDown, Plus } from 'lucide-react'

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
import { getMyMemberships } from '@/organization/getMyMembershipts'
import { superAction } from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { redirect } from 'next/navigation'
import { ResponsiveDropdownMenuContent } from '../ResponsiveDropdownMenuContent'
import SeededAvatar from '../SeededAvatar'

export const SidebarOrgSwitcher = async ({ orgSlug }: { orgSlug?: string }) => {
  const memberships = await getMyMemberships()
  const selectedMembership = memberships.find(
    (membership) => membership.organization.slug === orgSlug,
  )

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
                <SeededAvatar
                  size={32}
                  style="shape"
                  value={selectedMembership?.organization.slug ?? ''}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {selectedMembership?.organization.name ??
                    'Select an organization'}
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
              Organizations
            </DropdownMenuLabel>
            {memberships.map((membership, index) => (
              <DropdownMenuItem
                key={membership.organization.id}
                className="gap-2 p-2"
                asChild
              >
                <ActionButton
                  variant="ghost"
                  className="w-full justify-start hocus:outline-none"
                  hideIcon
                  action={async () => {
                    'use server'
                    return superAction(async () => {
                      redirect(`/org/${membership.organization.slug}`)
                    })
                  }}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <SeededAvatar
                      size={20}
                      style="shape"
                      value={membership.organization.slug}
                    />
                  </div>
                  {membership.organization.name}
                </ActionButton>
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

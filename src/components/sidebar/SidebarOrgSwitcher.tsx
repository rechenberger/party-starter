import { ChevronsUpDown, Plus } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuGroup,
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
import { getTranslations } from '@/i18n/getTranslations'
import { canUserCreateOrg } from '@/organization/canUserCreateOrg'
import { getMyMemberships } from '@/organization/getMyMemberships'
import Link from 'next/link'
import { OrgAvatar } from '../OrgAvatar'
import { ResponsiveDropdownMenuContent } from '../ResponsiveDropdownMenuContent'

export const SidebarOrgSwitcher = async ({ orgSlug }: { orgSlug?: string }) => {
  const [memberships, userCanCreateOrg] = await Promise.all([
    getMyMemberships(),
    canUserCreateOrg(),
  ])

  const selectedMembership = memberships.find(
    (membership) => membership.organization.slug === orgSlug,
  )

  const t = await getTranslations()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            nativeButton
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {selectedMembership?.organization && (
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                    <OrgAvatar
                      org={selectedMembership.organization}
                      size={28}
                    />
                  </div>
                )}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {selectedMembership?.organization.name ??
                      t.org.selectOrganization}
                  </span>
                  {/* <span className="truncate text-xs">{'activeTeam.plan'}</span> */}
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            }
          />
          <ResponsiveDropdownMenuContent
            align="start"
            className="w-(--anchor-width) min-w-56 rounded-lg"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                {t.org.organizations}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            {memberships.map((membership) => (
              <DropdownMenuItem
                key={membership.organization.id}
                className="gap-2 py-2"
                asChild
                nativeButton={false}
              >
                <Link href={`/org/${membership.organization.slug}`}>
                  <OrgAvatar org={membership.organization} size={32} />
                  {membership.organization.name}
                </Link>
              </DropdownMenuItem>
            ))}
            {userCanCreateOrg && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2"
                  asChild
                  nativeButton={false}
                >
                  <Link href="/org/create">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                      <Plus className="size-4" />
                    </div>
                    <div className="text-muted-foreground font-medium">
                      {t.org.createOrg.title}
                    </div>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </ResponsiveDropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

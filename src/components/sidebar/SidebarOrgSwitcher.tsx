'use client'

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
import { useTranslations } from '@/i18n/useTranslations'
import { serializeLastUsedOrgCookie } from '@/organization/lastUsedOrgCookie'
import { CurrentOrgContext } from '@/organization/resolveCurrentOrgContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { OrgAvatar } from '../OrgAvatar'
import { ResponsiveDropdownMenuContent } from '../ResponsiveDropdownMenuContent'

export const SidebarOrgSwitcher = ({
  memberships,
  activeOrgSlug,
  canCreateOrg,
}: {
  memberships: CurrentOrgContext['memberships']
  activeOrgSlug: string
  canCreateOrg?: boolean
}) => {
  const router = useRouter()
  const selectedMembership = memberships.find(
    (membership) => membership.organization.slug === activeOrgSlug,
  )
  const t = useTranslations()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              data-testid="sidebar-org-switcher-trigger"
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {selectedMembership?.organization && (
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <OrgAvatar org={selectedMembership.organization} size={28} />
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
          </DropdownMenuTrigger>
          <ResponsiveDropdownMenuContent
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t.org.organizations}
            </DropdownMenuLabel>
            {memberships.map((membership) => (
              <DropdownMenuItem
                key={membership.organization.id}
                className="gap-2 py-2"
                onSelect={() => {
                  document.cookie = serializeLastUsedOrgCookie(
                    membership.organization.slug,
                  )
                  router.push(`/org/${membership.organization.slug}`)
                }}
              >
                <OrgAvatar org={membership.organization} size={32} />
                {membership.organization.name}
              </DropdownMenuItem>
            ))}
            {canCreateOrg && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2" asChild>
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

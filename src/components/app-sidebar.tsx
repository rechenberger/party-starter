import * as React from 'react'

import { getIsAdmin } from '@/auth/getIsAdmin'
import { NavAdmin } from '@/components/nav-admin'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { PartyPopperIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { NavMain } from './nav-main'
import { TeamSwitcher } from './team-switcher'
import { Skeleton } from './ui/skeleton'

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const isAdminOrDev = await getIsAdmin({ allowDev: true })
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="hidden p-2 group-data-[collapsible=icon]:block">
              <Link href="/">
                <PartyPopperIcon className="size-4" />
              </Link>
            </div>
            <Link
              href="/"
              className="flex flex-row items-center gap-2 w-full overflow-hidden p-2 group-data-[collapsible=icon]:hidden"
            >
              <div className="text-xl">
                <strong>
                  Party <span className="text-primary">Starter</span>
                </strong>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        <Suspense fallback={<Skeleton className="w-full h-[48px]" />}>
          <TeamSwitcher />
        </Suspense>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        {isAdminOrDev && <NavAdmin />}
        <Suspense fallback={<Skeleton className="w-full h-[48px]" />}>
          <NavUser />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

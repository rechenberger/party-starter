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
import Link from 'next/link'
import { Suspense } from 'react'
import { NavMain } from './nav-main'
import { OrgSwitcher } from './OrgSwitchter'
import { Skeleton } from './ui/skeleton'

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const isAdminOrDev = await getIsAdmin({ allowDev: true })
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row gap-2 items-center p-2">
            <div className="">
              <Link href="/">🎉</Link>
            </div>
            <Link
              href="/"
              className="flex flex-row items-center gap-2 w-full overflow-hidden group-data-[collapsible=icon]:hidden"
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
          <OrgSwitcher />
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

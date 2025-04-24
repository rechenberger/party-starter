import { SidebarAdminSection } from '@/components/sidebar/SidebarAdminSection'
import { SidebarUserSection } from '@/components/sidebar/SidebarUserSection'
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  Sidebar as UiSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import * as React from 'react'
import { Suspense } from 'react'
import { Skeleton } from '../ui/skeleton'
import { SidebarMainSection } from './SidebarMainSection'
import { SidebarOrgsSelectSection } from './SidebarOrgsSelectSection'
import { SidebarOrgSwitcher } from './SidebarOrgSwitcher'

export const Sidebar = ({
  orgSlug,
  ...props
}: React.ComponentProps<typeof UiSidebar> & { orgSlug?: string }) => {
  return (
    <UiSidebar collapsible="icon" {...props}>
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

        {!!orgSlug && (
          <Suspense fallback={<Skeleton className="w-full h-[48px]" />}>
            <SidebarOrgSwitcher orgSlug={orgSlug} />
          </Suspense>
        )}
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<Skeleton className="w-full h-[48px]" />}>
          {!!orgSlug ? <SidebarMainSection /> : <SidebarOrgsSelectSection />}
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <Suspense>
          <SidebarAdminSection />
        </Suspense>
        <Suspense fallback={<Skeleton className="w-full h-[48px]" />}>
          <SidebarUserSection />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </UiSidebar>
  )
}

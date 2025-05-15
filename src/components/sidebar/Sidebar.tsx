import { SidebarAdminSection } from '@/components/sidebar/SidebarAdminSection'
import { SidebarUserSection } from '@/components/sidebar/SidebarUserSection'
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
  Sidebar as UiSidebar,
} from '@/components/ui/sidebar'
import { getMyLocale } from '@/i18n/getMyLocale'
import { BRAND, ORGS } from '@/lib/starter.config'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import { Suspense } from 'react'
import { Skeleton } from '../ui/skeleton'
import { SidebarMainSection } from './SidebarMainSection'
import { SidebarOrgSection } from './SidebarOrgSection'
import { SidebarOrgSwitcher } from './SidebarOrgSwitcher'

export const Sidebar = async ({
  orgSlug,
  ...props
}: React.ComponentProps<typeof UiSidebar> & { orgSlug?: string }) => {
  const locale = await getMyLocale()
  return (
    <UiSidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuButton
            className="flex flex-row gap-2 items-center"
            size="lg"
            asChild
          >
            <Link
              href={`/${locale}`}
              className="flex flex-row items-center gap-2 w-full overflow-hidden"
            >
              <Image
                src={BRAND.logoUrl}
                className="p-1"
                alt={BRAND.name}
                width={32}
                height={32}
              />
              <span className="text-xl">
                <BRAND.TextLogo />
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>

        {!!orgSlug && ORGS.isActive && (
          <Suspense fallback={<Skeleton className="w-full h-[48px]" />}>
            <SidebarOrgSwitcher orgSlug={orgSlug} />
          </Suspense>
        )}
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<Skeleton className="w-full h-[48px]" />}>
          {!!orgSlug && ORGS.isActive ? (
            <SidebarOrgSection />
          ) : (
            <SidebarMainSection />
          )}
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

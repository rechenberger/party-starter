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
import { Locale } from '@/i18n/locale'
import { BRAND, ORGS } from '@/lib/starter.config'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import { Suspense } from 'react'
import { DevBadges } from '../layout/DevBadges'
import { Skeleton } from '../ui/skeleton'
import { SidebarAnonymousSettingsSection } from './SidebarAnonymousSettingsSection'
import { SidebarMainSection } from './SidebarMainSection'
import { SidebarOrgSection } from './SidebarOrgSection'
import { SidebarOrgSwitcher } from './SidebarOrgSwitcher'

export const Sidebar = ({
  orgSlug,
  locale,
  isLanding,
  ...props
}: React.ComponentProps<typeof UiSidebar> & {
  orgSlug?: string
  locale?: Locale
  isLanding?: boolean
}) => {
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
              href={`/`}
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
            <SidebarOrgSection orgSlug={orgSlug} />
          ) : (
            <SidebarMainSection isLanding={isLanding} locale={locale} />
          )}
        </Suspense>
        {!isLanding && (
          <Suspense>
            <SidebarAdminSection />
          </Suspense>
        )}
        <Suspense>
          <SidebarAnonymousSettingsSection />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <DevBadges className="px-2 group-data-[collapsible=icon]:hidden" />
        <Suspense fallback={<Skeleton className="w-full h-[48px]" />}>
          <SidebarUserSection locale={locale} />
        </Suspense>
      </SidebarFooter>
      <SidebarRail />
    </UiSidebar>
  )
}

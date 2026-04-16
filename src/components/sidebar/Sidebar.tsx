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
import { BRAND } from '@/lib/starter.config'
import { CurrentOrgContext } from '@/organization/resolveCurrentOrgContext'
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
  orgContext,
  canCreateOrg,
  locale,
  isLanding,
  ...props
}: React.ComponentProps<typeof UiSidebar> & {
  orgContext?: CurrentOrgContext | null
  canCreateOrg?: boolean
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

        {orgContext && (
          <SidebarOrgSwitcher
            memberships={orgContext.memberships}
            activeOrgSlug={orgContext.org.slug}
            canCreateOrg={canCreateOrg}
          />
        )}
      </SidebarHeader>
      <SidebarContent>
        {orgContext ? (
          <SidebarOrgSection
            org={orgContext.org}
            role={orgContext.membership.role}
          />
        ) : (
          <Suspense fallback={<Skeleton className="w-full h-[48px]" />}>
            <SidebarMainSection isLanding={isLanding} locale={locale} />
          </Suspense>
        )}
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

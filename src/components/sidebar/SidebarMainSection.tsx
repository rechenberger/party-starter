import { getIsLoggedIn } from '@/auth/getMyUser'
import { getTranslations } from '@/i18n/getTranslations'
import { Locale } from '@/i18n/locale'
import { ORGS } from '@/lib/starter.config'
import { canUserCreateOrg } from '@/organization/canUserCreateOrg'
import { getMyMemberships } from '@/organization/getMyMemberships'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'
import { OrgAvatar } from '../OrgAvatar'
import { getNavEntries } from '../layout/nav'
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '../ui/sidebar'
import { SidebarNavEntry } from './SidebarNavEntry'

export const SidebarMainSection = async ({
  isLanding,
  locale,
}: {
  isLanding?: boolean
  locale?: Locale
}) => {
  const [isLoggedIn, memberships, userCanCreateOrg] = await Promise.all([
    getIsLoggedIn(),
    getMyMemberships(),
    canUserCreateOrg(),
  ])
  const t = await getTranslations({ locale })

  let entries = await getNavEntries({
    filter: isLanding ? 'landing' : 'main',
    locale,
  })
  return (
    <>
      <SidebarGroup>
        {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
        <SidebarMenu>
          {entries.map((entry) => (
            <Fragment key={entry.href}>
              <SidebarNavEntry entry={entry} />
            </Fragment>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      {!isLanding && ORGS.isActive && isLoggedIn && (
        <SidebarGroup>
          <SidebarGroupLabel>{t.org.organizations}</SidebarGroupLabel>
          {userCanCreateOrg && memberships.length > 0 && (
            <SidebarGroupAction title={t.org.createOrg.create}>
              <Link href={`/org/create`}>
                <Plus className="size-4" />
              </Link>
            </SidebarGroupAction>
          )}
          <SidebarMenu>
            {memberships.map((membership) => (
              <Fragment key={membership.organization.id}>
                <SidebarMenuButton
                  size="lg"
                  tooltip={membership.organization.name}
                  asChild
                >
                  <Link href={`/org/${membership.organization.slug}`}>
                    <OrgAvatar org={membership.organization} size={28} />
                    <span>{membership.organization.name}</span>
                  </Link>
                </SidebarMenuButton>
              </Fragment>
            ))}
            {userCanCreateOrg && memberships.length === 0 && (
              <SidebarMenuButton tooltip={t.org.createOrg.create} asChild>
                <Link href={`/org/create`}>
                  <Plus size={20} />
                  <span>{t.org.createOrg.create}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenu>
        </SidebarGroup>
      )}
      <div className="flex-1" />
    </>
  )
}

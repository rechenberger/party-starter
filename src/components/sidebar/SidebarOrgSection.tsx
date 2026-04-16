import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { getTranslations } from '@/i18n/getTranslations'
import { OrganizationRole } from '@/organization/organizationRoles'
import { CurrentOrgContext } from '@/organization/resolveCurrentOrgContext'
import { Building2, Home, Laugh, Users } from 'lucide-react'
import { NavEntry } from '../layout/nav'
import { SidebarNavEntry } from './SidebarNavEntry'

const defaultViewRoles: OrganizationRole[] = ['admin', 'member']
const protectedViewRoles: OrganizationRole[] = ['admin']

export const SidebarOrgSection = async ({
  org,
  role,
}: {
  org: CurrentOrgContext['org']
  role: CurrentOrgContext['membership']['role']
}) => {
  const t = await getTranslations()

  const items: NavEntry[] = [
    {
      name: 'Dashboard',
      href: `/org/${org.slug}`,
      icon: <Home />,
      exactMatch: true,
    },
    {
      name: 'Say Hello',
      href: `/org/${org.slug}?say=hello`,
      icon: <Laugh />,
    },
  ]

  let settings: NavEntry[] = [
    {
      name: t.org.organization,
      href: `/org/${org.slug}/settings`,
      icon: <Building2 />,
      hidden: !protectedViewRoles.includes(role),
      exactMatch: true,
    },
    {
      name: t.org.members.title,
      href: `/org/${org.slug}/settings/members`,
      icon: <Users />,
      hidden: !defaultViewRoles.includes(role),
    },
  ]

  settings = settings.filter((setting) => !setting.hidden)

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>{org.name}</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarNavEntry key={item.href} entry={item} />
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <div className="flex-1" />
      {settings.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel>{t.org.settings}</SidebarGroupLabel>
          <SidebarMenu>
            {settings.map((item) => (
              <SidebarNavEntry key={item.href} entry={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  )
}

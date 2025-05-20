import { getIsAdmin } from '@/auth/getIsAdmin'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { getMyLocale } from '@/i18n/getMyLocale'
import { Building2, HomeIcon, UsersIcon } from 'lucide-react'
import { MainTopNavEntries } from './MainTopNavEntries'

export const getNavEntries = async () => {
  const isAdminOrDev = await getIsAdmin({ allowDev: true })
  const isLoggedIn = await getIsLoggedIn()
  const locale = await getMyLocale()

  const entries = [
    {
      name: 'Home',
      href: `/${locale}`,
      icon: <HomeIcon />,
      mainSidebarSection: isLoggedIn ? undefined : 'main',
    },
    {
      name: 'Users',
      href: '/users',
      hidden: !isAdminOrDev,
      icon: <UsersIcon />,
      mainSidebarSection: 'admin',
    },
    {
      name: 'Dashboard',
      href: '/app',
      hidden: !isLoggedIn,
      icon: <Building2 />,
      mainSidebarSection: 'main',
    },
  ].filter((entry) => !entry.hidden)

  return entries
}

export type NavEntry = Awaited<ReturnType<typeof getNavEntries>>[number]

export const MainTopContent = async () => {
  const entries = await getNavEntries()

  return <MainTopNavEntries entries={entries} />
}

import { getIsAdmin } from '@/auth/getIsAdmin'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { getMyLocale } from '@/i18n/getMyLocale'
import { Building2, HomeIcon, UserIcon, UsersIcon } from 'lucide-react'
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
    },
    {
      name: 'Me',
      href: '/auth/me',
      hidden: !isLoggedIn,
      icon: <UserIcon />,
    },
    {
      name: 'Users',
      href: '/users',
      hidden: !isAdminOrDev,
      hideInSidebar: true,
      icon: <UsersIcon />,
      adminOnly: true,
    },
    {
      name: 'App',
      href: '/org',
      hidden: !isLoggedIn,
      icon: <Building2 />,
    },
  ].filter((entry) => !entry.hidden)

  return entries
}

export type NavEntry = Awaited<ReturnType<typeof getNavEntries>>[number]

export const MainTopContent = async () => {
  const entries = await getNavEntries()

  return <MainTopNavEntries entries={entries} />
}

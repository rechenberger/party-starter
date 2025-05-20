import { getIsAdmin } from '@/auth/getIsAdmin'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { getMyLocale } from '@/i18n/getMyLocale'
import { Building2, Home, Users } from 'lucide-react'

export const getNavEntries = async ({
  filter,
}: {
  filter: 'landing' | 'main' | 'admin'
}) => {
  const isAdminOrDev = await getIsAdmin({ allowDev: true })
  const isLoggedIn = await getIsLoggedIn()
  const locale = await getMyLocale()

  const entries = [
    {
      name: 'Home',
      href: `/${locale}`,
      icon: <Home />,
      mainSidebarSection: isLoggedIn ? undefined : 'main',
      showOnLanding: true,
    },
    {
      name: 'Users',
      href: '/users',
      hidden: !isAdminOrDev,
      icon: <Users />,
      mainSidebarSection: 'admin',
      showOnLanding: true,
    },
    {
      name: 'Dashboard',
      href: '/app',
      hidden: !isLoggedIn,
      icon: <Building2 />,
      mainSidebarSection: 'main',
      showOnLanding: false,
    },
  ].filter((entry) => !entry.hidden)

  if (filter === 'landing') {
    return entries.filter((entry) => entry.showOnLanding)
  } else {
    return entries.filter((entry) => entry.mainSidebarSection === filter)
  }
}

export type NavEntry = Awaited<ReturnType<typeof getNavEntries>>[number]

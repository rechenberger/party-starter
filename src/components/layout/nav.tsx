import { getIsAdmin } from '@/auth/getIsAdmin'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { getMyLocale } from '@/i18n/getMyLocale'
import { getTranslations } from '@/i18n/getTranslations'
import { Building2, Home, Users } from 'lucide-react'

export type NavEntry = {
  name: string
  href: string
  icon: React.ReactNode
  mainSidebarSection?: 'main' | 'admin'
  showOnLanding?: boolean
  hidden?: boolean
  exactMatch?: boolean
}

export const getNavEntries = async ({
  filter,
}: {
  filter: 'landing' | 'main' | 'admin'
}) => {
  const isAdminOrDev = await getIsAdmin({ allowDev: true })
  const isLoggedIn = await getIsLoggedIn()
  const locale = await getMyLocale()
  const t = await getTranslations()

  let entries: NavEntry[] = [
    {
      name: t.nav.home,
      href: `/${locale}`,
      icon: <Home />,
      mainSidebarSection: isLoggedIn ? undefined : 'main',
      showOnLanding: true,
      exactMatch: true,
    },
    {
      name: t.nav.users,
      href: '/users',
      hidden: !isAdminOrDev,
      icon: <Users />,
      mainSidebarSection: 'admin',
      showOnLanding: true,
    },
    {
      name: t.nav.dashboard,
      href: '/app',
      hidden: !isLoggedIn,
      icon: <Building2 />,
      mainSidebarSection: 'main',
      showOnLanding: false,
    },
  ]

  entries = entries.filter((entry) => !entry.hidden)

  if (filter === 'landing') {
    return entries.filter((entry) => entry.showOnLanding)
  } else {
    return entries.filter((entry) => entry.mainSidebarSection === filter)
  }
}

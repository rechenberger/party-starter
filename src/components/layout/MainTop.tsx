import { UserButtonSuspense } from '@/auth/UserButton'
import { getIsAdmin } from '@/auth/getIsAdmin'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { DarkModeToggle } from '@/components/layout/DarkModeToggle'
import { Button } from '@/components/ui/button'
import { BRAND } from '@/lib/starter.config'
import { Building2, Github, HomeIcon, UserIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { DevBadges } from './DevBadges'
import { MainTopNavEntries } from './MainTopNavEntries'

export const MainTop = () => {
  return (
    <>
      <div className="container flex flex-row items-center justify-between gap-6 py-6">
        <Link href="/" className="flex flex-row items-center gap-3">
          <div className="text-xl">
            <BRAND.TextLogo />
          </div>
        </Link>
        <div className="hidden flex-1 xl:flex items-center gap-2">
          <Suspense fallback={<div className="flex-1" />}>
            <nav
              className={'flex flex-1 flex-wrap items-center gap-4 lg:gap-6'}
            >
              <MainTopContent />
              <div className="flex-1" />
            </nav>
          </Suspense>
          <DevBadges />
          <UserButtonSuspense />
        </div>
        <div className="flex flex-row">
          {BRAND.github.active && (
            <Button variant={'ghost'} size="icon" asChild>
              <Link href={BRAND.github.url} target="_blank">
                <Github />
              </Link>
            </Button>
          )}
          <DarkModeToggle />
        </div>
      </div>
      <div className="container flex pb-6 xl:hidden items-center gap-2 flex-wrap">
        <Suspense fallback={<div className="flex-1" />}>
          <nav className={'flex flex-1 flex-wrap items-center gap-4 lg:gap-6'}>
            <MainTopContent />
            <div className="flex-1" />
          </nav>
        </Suspense>
        <DevBadges />
        <UserButtonSuspense />
      </div>
    </>
  )
}

export const getNavEntries = async () => {
  const isAdminOrDev = await getIsAdmin({ allowDev: true })
  const isLoggedIn = await getIsLoggedIn()

  const entries = [
    {
      name: 'Home',
      href: '/',
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

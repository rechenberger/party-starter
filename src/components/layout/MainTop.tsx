import { UserButtonSuspense } from '@/auth/UserButton'
import { getIsAdmin } from '@/auth/getIsAdmin'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { DarkModeToggle } from '@/components/layout/DarkModeToggle'
import { Button } from '@/components/ui/button'
import { getMyLocale } from '@/i18n/getMyLocale'
import { BRAND } from '@/lib/starter.config'
import { Github } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { DevBadges } from './DevBadges'
import { MainTopNav } from './MainTopNav'

export const MainTop = async () => {
  const locale = await getMyLocale()
  return (
    <>
      <div className="container flex flex-row items-center justify-between gap-6 py-6">
        <Link href={`/${locale}`} className="flex flex-row items-center gap-3">
          <div className="text-xl">
            <BRAND.TextLogo />
          </div>
        </Link>
        <div className="hidden flex-1 xl:flex items-center gap-2">
          <Suspense fallback={<div className="flex-1" />}>
            <MainTopContent />
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
          <MainTopContent />
        </Suspense>
        <DevBadges />
        <UserButtonSuspense />
      </div>
    </>
  )
}

export const MainTopContent = async () => {
  const isAdminOrDev = await getIsAdmin({ allowDev: true })
  const isLoggedIn = await getIsLoggedIn()
  const locale = await getMyLocale()
  const entries = [
    {
      name: 'Home',
      href: `/${locale}`,
    },
    {
      name: 'Me',
      href: `/auth/me`,
      hidden: !isLoggedIn,
    },
    {
      name: 'Users',
      href: '/users',
      hidden: !isAdminOrDev,
    },
  ].filter((entry) => !entry.hidden)

  return (
    <>
      <MainTopNav entries={entries} />
    </>
  )
}

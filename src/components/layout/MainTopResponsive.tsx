import { UserButtonSuspense } from '@/auth/UserButton'
import { Button } from '@/components/ui/button'
import { BRAND } from '@/lib/starter.config'
import { cn } from '@/lib/utils'
import { Github, MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { Sidebar } from '../sidebar/Sidebar'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { DarkModeToggle } from './DarkModeToggle'
import { DevBadges } from './DevBadges'
import { MainTopContent } from './MainTop'

export const MainTopResponsive = async () => {
  return (
    <SidebarProvider className="min-h-auto">
      <header className="sticky top-0 z-50 w-full border-b">
        <div className="container mx-auto flex max-w-6xl items-center justify-between gap-6 py-6">
          <Link href="/" className="flex flex-row items-center gap-3">
            <div className="text-xl">
              <BRAND.TextLogo />
            </div>
          </Link>
          <Suspense fallback={<div className="flex-1" />}>
            <nav
              className={cn(
                'hidden md:flex flex-1 flex-wrap items-center gap-4 lg:gap-6',
              )}
            >
              <MainTopContent />
              <div className="flex-1" />
            </nav>
          </Suspense>
          <div className="flex items-center gap-4">
            <DevBadges />
            <UserButtonSuspense />
            <div className="hidden items-center gap-2 text-sm font-medium md:flex">
              {BRAND.github.active && (
                <Button variant={'ghost'} size="icon" asChild>
                  <Link href={BRAND.github.url} target="_blank">
                    <Github />
                  </Link>
                </Button>
              )}
              <DarkModeToggle />
            </div>
            <SidebarTrigger
              className="md:hidden"
              icon={<MenuIcon className="size-4" />}
            />
            <div className="md:hidden">
              <Sidebar collapsible="icon" />
            </div>
          </div>
        </div>
      </header>
    </SidebarProvider>
  )
}

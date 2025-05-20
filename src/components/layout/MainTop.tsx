import { Button } from '@/components/ui/button'
import { BRAND } from '@/lib/starter.config'
import { cn } from '@/lib/utils'
import { Github, MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { Sidebar } from '../sidebar/Sidebar'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { DevBadges } from './DevBadges'
import { MainDashboardButton } from './MainDashboardButton'
import { MainTopContent } from './MainTopContent'
import { MainTopUserSettings } from './MainTopUserSettings'

export const MainTop = async () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 bg-background/95 backdrop-blur-sm">
      <SidebarProvider className="min-h-auto">
        <div className="container flex items-center gap-2 md:gap-6 py-6">
          <SidebarTrigger
            className="md:hidden"
            icon={<MenuIcon className="size-4" />}
          />
          <Link
            href="/"
            prefetch={false}
            className="flex flex-row items-center gap-3"
          >
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
            </nav>
          </Suspense>
          <div className="flex-1 md:hidden" />
          <div className="flex items-center gap-4">
            <DevBadges className="max-md:hidden" />
            <div className="hidden items-center gap-2 text-sm font-medium md:flex">
              {BRAND.github.active && (
                <Button variant={'ghost'} size="icon" asChild>
                  <Link href={BRAND.github.url} target="_blank">
                    <Github />
                  </Link>
                </Button>
              )}

              <MainTopUserSettings />
            </div>
            <MainDashboardButton />
          </div>
        </div>
        <div className="md:hidden">
          <Sidebar collapsible="icon" isLanding={true} />
        </div>
      </SidebarProvider>
    </header>
  )
}

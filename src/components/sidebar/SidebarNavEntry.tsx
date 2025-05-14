'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavEntry } from '../layout/MainTop'
import { SidebarMenuButton } from '../ui/sidebar'

export function SidebarNavEntry({ entry }: { entry: NavEntry }) {
  const pathname = usePathname()
  const isActive =
    entry.href === '/'
      ? pathname === entry.href
      : pathname?.startsWith(entry.href)
  return (
    <SidebarMenuButton size="default" tooltip={entry.name} asChild>
      <Link href={entry.href}>
        {entry.icon && (
          <div
            className={cn(
              'size-4 flex items-center',
              isActive && 'text-primary',
            )}
          >
            {entry.icon}
          </div>
        )}
        <span className={cn(!isActive && 'text-muted-foreground')}>
          {entry.name}
        </span>
      </Link>
    </SidebarMenuButton>
  )
}

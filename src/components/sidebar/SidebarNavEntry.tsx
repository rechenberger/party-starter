'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavEntry } from '../layout/MainTop'

export function SidebarNavEntry({ entry }: { entry: NavEntry }) {
  const pathname = usePathname()
  const isActive =
    entry.href === '/'
      ? pathname === entry.href
      : pathname?.startsWith(entry.href)
  return (
    <Link
      href={entry.href}
      className={cn(
        'flex gap-1 items-center',
        !isActive && 'text-muted-foreground',
      )}
    >
      {entry.icon && (
        <div
          className={cn('size-4 flex items-center', isActive && 'text-primary')}
        >
          {entry.icon}
        </div>
      )}
      <div>{entry.name}</div>
    </Link>
  )
}

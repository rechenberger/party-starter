'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavEntry } from './MainTop'

export function MainTopNavEntries({ entries }: { entries: NavEntry[] }) {
  const pathname = usePathname()
  return (
    <>
      {entries.map((entry) => {
        const isActive =
          entry.href === '/'
            ? pathname === entry.href
            : pathname?.startsWith(entry.href)
        return (
          <Link
            key={entry.href}
            href={entry.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary flex gap-1',
              !isActive && 'text-muted-foreground',
            )}
          >
            <span>{entry.name}</span>
          </Link>
        )
      })}
    </>
  )
}

'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { NavEntry } from './nav'
import { useNavEntryState } from './useNavEntry'

export function MainTopNavEntry({ entry }: { entry: NavEntry }) {
  const { isActive } = useNavEntryState({ entry })
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
}

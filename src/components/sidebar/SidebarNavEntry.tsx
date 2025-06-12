'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { NavEntry } from '../layout/nav'
import { useNavEntryState } from '../layout/useNavEntry'
import { SidebarMenuButton } from '../ui/sidebar'

export function SidebarNavEntry({ entry }: { entry: NavEntry }) {
  const { isActive } = useNavEntryState({ entry })
  return (
    <SidebarMenuButton
      size="default"
      tooltip={entry.name}
      isActive={isActive}
      asChild
    >
      <Link href={entry.href}>
        {entry.icon && (
          <div className={cn('size-4 flex items-center')}>{entry.icon}</div>
        )}
        <span>{entry.name}</span>
      </Link>
    </SidebarMenuButton>
  )
}

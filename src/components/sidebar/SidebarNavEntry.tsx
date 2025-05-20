'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavEntry } from '../layout/nav'
import { SidebarMenuButton } from '../ui/sidebar'

export function SidebarNavEntry({ entry }: { entry: NavEntry }) {
  const pathname = usePathname()
  const isActive =
    entry.href === '/'
      ? pathname === entry.href
      : pathname?.startsWith(entry.href)
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

'use client'

import { cn } from '@/lib/utils'
import { DropdownMenuContent } from './ui/dropdown-menu'
import { useSidebar } from './ui/sidebar'

export const UserDropdownMenuContent = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const { isMobile } = useSidebar()

  return (
    <DropdownMenuContent
      className={cn(className)}
      side={isMobile ? 'bottom' : 'right'}
      align="end"
      sideOffset={4}
    >
      {children}
    </DropdownMenuContent>
  )
}

'use client'

import { cn } from '@/lib/utils'
import { DropdownMenuContent } from './ui/dropdown-menu'
import { useSidebar } from './ui/sidebar'

export const ResponsiveDropdownMenuContent = ({
  children,
  className,
  align,
}: {
  children: React.ReactNode
  className?: string
  align: React.ComponentProps<typeof DropdownMenuContent>['align']
}) => {
  const { isMobile } = useSidebar()

  return (
    <DropdownMenuContent
      className={cn(className)}
      side={isMobile ? 'bottom' : 'right'}
      align={align}
      sideOffset={4}
    >
      {children}
    </DropdownMenuContent>
  )
}

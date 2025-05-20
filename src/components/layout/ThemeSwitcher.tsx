'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { SidebarMenuButton } from '../ui/sidebar'

export function ThemeSwitcher({
  variant,
}: {
  variant?: 'sidebar' | 'submenu'
}) {
  const { setTheme, theme: currentTheme } = useTheme()
  const themes = [
    {
      label: 'Light',
      icon: Sun,
      value: 'light',
    },
    {
      label: 'Dark',
      icon: Moon,
      value: 'dark',
    },
    {
      label: 'System',
      icon: Monitor,
      value: 'system',
    },
  ]

  const icon = (
    <>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </>
  )

  const label = 'Change Theme'

  const dropdownMenuItems = (
    <>
      {themes.map((theme) => (
        <DropdownMenuItem
          key={theme.value}
          onClick={() => setTheme(theme.value)}
          disabled={theme.value === currentTheme}
        >
          <theme.icon className={cn('size-4')} />
          <span className="flex-1">{theme.label}</span>
          {theme.value === currentTheme && <Check className="size-4" />}
        </DropdownMenuItem>
      ))}
    </>
  )

  if (variant === 'submenu') {
    return (
      <>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {icon}
            <span>{label}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>{dropdownMenuItems}</DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'sidebar' ? (
          <SidebarMenuButton>
            {icon}
            <span>{label}</span>
          </SidebarMenuButton>
        ) : (
          <Button variant="ghost" size="icon">
            {icon}
            <span className="sr-only">{label}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{dropdownMenuItems}</DropdownMenuContent>
    </DropdownMenu>
  )
}

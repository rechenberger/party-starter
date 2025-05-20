'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { SidebarMenuButton } from '../ui/sidebar'

export function ThemeSwitcher({ variant }: { variant?: 'sidebar' }) {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'sidebar' ? (
          <SidebarMenuButton>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="">Change theme</span>
          </SidebarMenuButton>
        ) : (
          <Button variant="ghost" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Change theme</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

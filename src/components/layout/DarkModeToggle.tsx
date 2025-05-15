'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

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

export function DarkModeToggle() {
  const { setTheme, theme: currentTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => setTheme(theme.value)}
          >
            <theme.icon
              className={cn(
                'size-4',
                theme.value === currentTheme && 'text-primary',
              )}
            />
            {theme.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

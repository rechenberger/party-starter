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
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { useTranslations } from '@/i18n/useTranslations'
import { cn } from '@/lib/utils'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeSwitcher({
  variant,
}: {
  variant?: 'sidebar' | 'submenu'
}) {
  const { setTheme, theme: currentTheme } = useTheme()
  const t = useTranslations()
  const themes = [
    {
      label: t.standardWords.theme.light,
      icon: Sun,
      value: 'light',
    },
    {
      label: t.standardWords.theme.dark,
      icon: Moon,
      value: 'dark',
    },
    {
      label: t.standardWords.theme.system,
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

  const label = t.standardWords.changeTheme

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
      {variant === 'sidebar' ? (
        <DropdownMenuTrigger
          nativeButton
          render={
            <SidebarMenuButton>
              {icon}
              <span>{label}</span>
            </SidebarMenuButton>
          }
        />
      ) : (
        <DropdownMenuTrigger
          nativeButton
          render={
            <Button variant="ghost" size="icon">
              {icon}
              <span className="sr-only">{label}</span>
            </Button>
          }
        />
      )}
      <DropdownMenuContent align="end">{dropdownMenuItems}</DropdownMenuContent>
    </DropdownMenu>
  )
}

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
import { Check } from 'lucide-react'
import { localeDefinitions } from './locale'
import { useLocale, useSetLocale } from './useLocale'
import { useTranslations } from './useTranslations'

const LocaleIcon = ({ locale }: { locale: string }) => {
  return (
    <span className="text-xs font-bold uppercase text-foreground/80">
      {locale}
    </span>
  )
}

export function LocaleSwitcher({
  variant,
}: {
  variant?: 'sidebar' | 'submenu'
}) {
  const locale = useLocale()
  const setLocale = useSetLocale()
  const t = useTranslations()
  const icon = <LocaleIcon locale={locale} />

  const label = t.standardWords.changeLanguage

  const dropdownMenuItems = (
    <>
      {localeDefinitions.map((l) => (
        <DropdownMenuItem
          key={l.locale}
          onClick={() => setLocale(l.locale)}
          disabled={l.locale === locale}
        >
          <LocaleIcon locale={l.locale} />
          <span className="flex-1">{l.nativeName}</span>
          {l.locale === locale && <Check className="size-4" />}
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

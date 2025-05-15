'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { LocaleDefinition, localeDefinitions } from './locale'
import { useLocale, useSetLocale } from './useLocale'

export const LocaleSelect = ({ className }: { className?: string }) => {
  const locale = useLocale()
  const setLocale = useSetLocale()
  // const t = useTranslationsApp()

  return (
    <div className={cn('text-foreground-dimmed', className)}>
      {/* <Label htmlFor="language">{t.settings.language}</Label> */}
      <Select
        defaultValue={locale}
        onValueChange={(newLocale: typeof locale) => {
          setLocale(newLocale)
        }}
        value={locale}
      >
        <SelectTrigger id="language" className="w-full">
          <SelectValue placeholder="Select language..." />
        </SelectTrigger>
        <SelectContent>
          {localeDefinitions.map((locale) => (
            <SelectItem key={locale.locale} value={locale.locale}>
              <div className="flex flex-row gap-2">
                {/* <span>{locale.flagEmoji}</span> */}
                <span>{locale.abbreviationLabel}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const LocaleSelectButton = ({
  locale,
}: {
  locale: LocaleDefinition
}) => {
  const setLocale = useSetLocale()
  return (
    <div
      className="w-full cursor-pointer"
      onClick={() => setLocale(locale.locale)}
    >
      {locale.abbreviationLabel}
    </div>
  )
}

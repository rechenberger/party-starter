import { Locale as DateFnsLocale, de, enUS } from 'date-fns/locale'
import { z } from 'zod'

export const LOCALES = ['en', 'de'] as const
export const Locale = z.enum(LOCALES)
export type Locale = z.infer<typeof Locale>
export const DEFAULT_LOCALE: Locale = 'en'
export const COOKIE_NAME = 'locale'

export const localeDefinitions: {
  locale: Locale
  nativeName: string
  flagEmoji: string
  abbreviationLabel: string
  actionLabel: string
  dateFnsLocale: DateFnsLocale
}[] = [
  {
    locale: 'en',
    nativeName: 'English',
    flagEmoji: '🇺🇸',
    abbreviationLabel: 'EN',
    actionLabel: 'Change language to English',
    dateFnsLocale: enUS,
  },
  {
    locale: 'de',
    nativeName: 'Deutsch',
    flagEmoji: '🇩🇪',
    abbreviationLabel: 'DE',
    actionLabel: 'Sprache zu Deutsch wechseln',
    dateFnsLocale: de,
  },
] as const

export type LocaleDefinition = (typeof localeDefinitions)[number]

export const getLocaleDefinition = (locale: Locale) => {
  const localeDefinition = localeDefinitions.find(
    (localeDefinition) => localeDefinition.locale === locale,
  )
  if (!localeDefinition) throw new Error(`Locale ${locale} not found`)
  return localeDefinition
}

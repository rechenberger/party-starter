import { getMyLocale } from './getMyLocale'
import { Locale } from './locale'

export const getTranslations = async ({ locale }: { locale?: Locale } = {}) => {
  const resolvedLocale = locale ?? (await getMyLocale())
  switch (resolvedLocale) {
    case 'de':
      return import('./translations/translations.server.de').then((m) => m.t)
    case 'en':
      return import('./translations/translations.server.en').then((m) => m.t)
  }
}

import 'server-only'

import { getMyLocale } from './getMyLocale'
import { Locale } from './locale'

export const getTranslations = async (locale?: Locale) => {
  locale = locale ?? (await getMyLocale())
  switch (locale) {
    case 'de':
      return import('./translations/translations.server.de').then((m) => m.t)
    case 'en':
      return import('./translations/translations.server.en').then((m) => m.t)
  }
}

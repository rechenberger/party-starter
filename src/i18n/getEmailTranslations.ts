import { getMyLocale } from './getMyLocale'
import { Locale } from './locale'

export const getEmailTranslations = async (locale?: Locale) => {
  locale = locale ?? (await getMyLocale())
  switch (locale) {
    case 'de':
      return import('./translations/emailTranslations.de').then((m) => m.t)
    case 'en':
      return import('./translations/emailTranslations.en').then((m) => m.t)
  }
}

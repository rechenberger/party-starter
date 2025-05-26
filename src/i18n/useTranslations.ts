import { useMemo } from 'react'
import { t as deT } from './translations/translations.de'
import { t as enT } from './translations/translations.en'
import { useLocale } from './useLocale'

export const useTranslations = () => {
  const locale = useLocale()
  console.log('locale', locale)
  return useMemo(() => {
    switch (locale) {
      case 'en':
        return enT
      case 'de':
        return deT
      default:
        const exhaustiveCheck: never = locale
        throw new Error(`Unsupported locale: ${exhaustiveCheck}`)
    }
  }, [locale])
}

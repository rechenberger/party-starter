import { useMemo } from 'react'
import { zodErrorTranslationsDe } from './translations/zodTranslations.de'
import { zodErrorTranslationsEn } from './translations/zodTranslations.en'
import { useLocale } from './useLocale'

export const useZodTranslations = () => {
  const locale = useLocale()

  return useMemo(() => {
    switch (locale) {
      case 'en':
        return zodErrorTranslationsEn
      case 'de':
        return zodErrorTranslationsDe
      default:
        const exhaustiveCheck: never = locale
        throw new Error(`Unsupported locale: ${exhaustiveCheck}`)
    }
  }, [locale])
}

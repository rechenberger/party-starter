import { getTranslations } from '@/i18n/getTranslations'
import { localeDefinitions } from '@/i18n/locale'
import { keyBy, replace } from 'lodash-es'
import type { Metadata, ResolvingMetadata } from 'next'
import { mapValues } from 'remeda'

export const generateMetadata = async (
  {
    params,
  }: {
    params: Promise<{ locale: string }>
  },
  parent: ResolvingMetadata,
) => {
  //TODO: make this reusable function
  const currentLocale = (await params).locale
  const parentMetadata = await parent
  const currentCanonical =
    parentMetadata['alternates']?.canonical?.url.toString() ?? ''
  const otherLocales = localeDefinitions.filter(
    (def) => def.locale !== currentLocale,
  )

  const alternates = mapValues(keyBy(otherLocales, 'locale'), (locale) =>
    replace(currentCanonical, currentLocale, locale.locale),
  )

  return {
    alternates: {
      canonical: currentCanonical,
      languages: {
        ...alternates,
      },
    },
  } satisfies Metadata
}

export default async function Page() {
  const t = await getTranslations()
  return <div>{t.welcome.title}</div>
}

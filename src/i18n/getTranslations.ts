import 'server-only'

import { getMyLocale } from './getMyLocale'

export const getTranslations = async ({
  params,
}: {
  params: Promise<{ locale?: string }>
}) => {
  const locale = await getMyLocale({ params })
  switch (locale) {
    case 'de':
      return import('./de.translations').then((m) => m.t)
    case 'en':
      return import('./en.translations').then((m) => m.t)
  }
}

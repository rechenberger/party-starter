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
      return import('./translations/translations.server.de').then((m) => m.t)
    case 'en':
      return import('./translations/translations.server.en').then((m) => m.t)
  }
}

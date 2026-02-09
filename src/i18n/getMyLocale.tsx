import { LOCALIZATION } from '@/lib/starter.config'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { cookies, headers } from 'next/headers'
import { COOKIE_NAME, DEFAULT_LOCALE, LOCALES, Locale } from './locale'

export const getMyLocale = async (
  options?: {
    paramsLocale?: unknown
  },
) => {
  if (!LOCALIZATION.isActive) {
    return DEFAULT_LOCALE
  }

  const locale =
    options?.paramsLocale ??
    (await getFromCookies()) ??
    (await getFromHeaders())

  const parsed = Locale.safeParse(locale)
  if (parsed.success) {
    return parsed.data
  }

  return DEFAULT_LOCALE
}

const getFromCookies = async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(COOKIE_NAME)?.value

  if (cookieLocale) {
    return cookieLocale
  }
}

const getFromHeaders = async () => {
  const headersList = await headers()
  const headersForNegotiator = {
    'accept-language': headersList.get('accept-language') ?? undefined,
  }
  const languages = new Negotiator({
    headers: headersForNegotiator,
  }).languages()

  const locale = match(languages, LOCALES, DEFAULT_LOCALE)
  return locale
}

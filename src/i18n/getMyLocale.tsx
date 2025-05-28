import { paramsContext } from '@/lib/paramsServerContext'
import { LOCALIZATION } from '@/lib/starter.config'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { cookies, headers } from 'next/headers'
import { COOKIE_NAME, DEFAULT_LOCALE, Locale, LOCALES } from './locale'

export const getMyLocale = async () => {
  if (!LOCALIZATION.isActive) {
    return DEFAULT_LOCALE
  }

  const locale =
    // (await getFromParams()) ??
    (await getFromCookies()) ?? (await getFromHeaders())

  const parsed = Locale.safeParse(locale)
  if (parsed.success) {
    return parsed.data
  }

  return DEFAULT_LOCALE
}

const getFromParams = async () => {
  const params = await paramsContext.get()
  const locale = params?.locale
  const parsedParamLocale = Locale.safeParse(locale)
  if (parsedParamLocale.success) {
    return parsedParamLocale.data
  }
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
  console.log({ localeFromHeaders: locale })

  return locale
}

import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { cookies, headers } from 'next/headers'
import { DEFAULT_LOCALE, Locale, LOCALES } from './locale'

export const getMyLocale = async ({
  params,
}: {
  params: Promise<{ locale?: string }>
}) => {
  const locale =
    (await getFromParams({ params })) ??
    (await getFromCookies()) ??
    (await getFromHeaders())

  const parsed = Locale.safeParse(locale)
  if (parsed.success) {
    return parsed.data
  }

  return DEFAULT_LOCALE
}

const getFromParams = async ({
  params,
}: {
  params: Promise<{ locale?: string }>
}) => {
  const locale = (await params)?.locale
  const parsedParamLocale = Locale.safeParse(locale)
  if (parsedParamLocale.success) {
    return parsedParamLocale.data
  }
}

const getFromCookies = async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('locale')?.value
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

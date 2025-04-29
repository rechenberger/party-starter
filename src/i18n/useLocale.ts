'use client'

import { usePathname, useRouter } from 'next/navigation'
import { use, useCallback, useEffect, useState } from 'react'
import { DEFAULT_LOCALE, Locale, LOCALES } from './locale'
import { LocaleContext } from './LocaleContext'

const COOKIE_NAME = 'locale'

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=31536000` // 1 year
}

const useLocaleLoaded = () => {
  const [localeLoaded, setLocaleLoaded] = useState(false)
  useEffect(() => {
    setLocaleLoaded(true)
  }, [])
  return localeLoaded
}

export const useLocale = () => {
  const locale = use(LocaleContext)
  const loaded = useLocaleLoaded()

  return loaded ? locale : DEFAULT_LOCALE
}

export const useSetLocale = () => {
  const router = useRouter()
  const pathname = usePathname()

  return useCallback(
    (locale: Locale) => {
      setCookie(COOKIE_NAME, locale)
      const isLocalePath = LOCALES.some((locale) =>
        pathname.startsWith(`/${locale}`),
      )
      if (isLocalePath) {
        router.push(pathname.replace(DEFAULT_LOCALE, locale))
      } else {
        router.refresh()
      }
    },
    [pathname, router],
  )
}

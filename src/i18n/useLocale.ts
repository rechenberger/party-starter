'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useContext } from 'react'
import { COOKIE_NAME, Locale, LOCALES } from './locale'
import { LocaleContext } from './LocaleContext'

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=31536000` // 1 year
}

export const useLocale = () => {
  const locale = useContext(LocaleContext)
  return locale
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
        router.push(pathname.replace(/^\/[^/]+/, `/${locale}`))
      } else {
        router.refresh()
      }
    },
    [pathname, router],
  )
}

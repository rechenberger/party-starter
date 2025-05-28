'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useContext } from 'react'
import { LocaleContext } from './LocaleContext'
import { COOKIE_NAME, LOCALES, Locale } from './locale'

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax;` // 1 year
}

export const useLocale = () => {
  const locale = useContext(LocaleContext)
  console.log({ localeFromContext: locale })
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
        router.refresh()
      } else {
        router.refresh()
      }
    },
    [pathname, router],
  )
}

'use client'

import { getDefaultOptions, setDefaultOptions } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import { createContext, useEffect } from 'react'
import { DEFAULT_LOCALE, Locale } from './locale'

export const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

export const LocaleProvider = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: Locale
}) => {
  // set default locale for date-fns
  useEffect(() => {
    const { locale } = getDefaultOptions()
    if (locale?.code.startsWith(value)) {
      return
    }
    setDefaultOptions({
      locale: value === 'de' ? de : enUS,
    })
  }, [value])

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

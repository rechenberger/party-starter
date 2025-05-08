'use client'

import { createContext } from 'react'
import { DEFAULT_LOCALE, Locale } from './locale'

export const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

export const LocaleProvider = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: Locale
}) => {
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

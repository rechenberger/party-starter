'use client'

import { useLocale } from '@/i18n/useLocale'

export const LocalDateTime = ({ datetime }: { datetime: string }) => {
  const locale = useLocale()
  const date = new Date(datetime)
  return <>{date.toLocaleString(locale)}</>
}

'use client'

import { useLocale } from '@/i18n/useLocale'

export const LocalDateTime = ({ datetime }: { datetime: string | Date }) => {
  const locale = useLocale()
  const date = typeof datetime === 'string' ? new Date(datetime) : datetime
  return <>{date.toLocaleString(locale)}</>
}

'use client'

import { useLocale } from '@/i18n/useLocale'
import { format } from 'date-fns'
import { de, enUS } from 'date-fns/locale'

export const LocalFormatToNow = ({ date }: { date: Date }) => {
  const locale = useLocale()
  const dateFnsLocale = locale === 'de' ? de : enUS
  return format(date, 'PPp', { locale: dateFnsLocale })
}

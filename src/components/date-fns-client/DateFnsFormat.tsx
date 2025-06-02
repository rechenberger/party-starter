'use client'

import { useDateFnsLocale } from '@/i18n/useDateFnsLocale'
import { format as formatFns } from 'date-fns'

export const DateFnsFormat = ({
  date,
  format,
  options,
}: {
  date: Parameters<typeof formatFns>[0]
  format: Parameters<typeof formatFns>[1]
  options?: Parameters<typeof formatFns>[2]
}) => {
  const dateFnsLocale = useDateFnsLocale()
  return formatFns(date, format, { locale: dateFnsLocale, ...options })
}

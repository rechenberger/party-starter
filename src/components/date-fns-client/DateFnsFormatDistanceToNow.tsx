'use client'

import { useDateFnsLocale } from '@/i18n/useDateFnsLocale'
import { formatDistanceToNow, format as formatFns } from 'date-fns'

export const DateFnsFormatDistanceToNow = ({
  date,
  options,
}: {
  date: Parameters<typeof formatDistanceToNow>[0]
  options?: Parameters<typeof formatDistanceToNow>[1]
}) => {
  const dateFnsLocale = useDateFnsLocale()
  return (
    <span
      title={`${formatFns(date, 'PPp', {
        locale: dateFnsLocale,
      })}`}
    >
      {formatDistanceToNow(date, {
        locale: dateFnsLocale,
        ...options,
      })}
    </span>
  )
}

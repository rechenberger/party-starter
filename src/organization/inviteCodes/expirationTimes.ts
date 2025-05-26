import { map } from 'remeda'
import { z } from 'zod'

export const expirationTimesDefinitions = [
  {
    value: '1d',
    label: '1 day',
    i18nKey: 'oneDay',
  },
  {
    value: '1w',
    label: '1 week',
    i18nKey: 'oneWeek',
  },
  {
    value: '1m',
    label: '1 month',
    i18nKey: 'oneMonth',
  },
  {
    value: '1y',
    label: '1 year',
    i18nKey: 'oneYear',
  },
  {
    value: 'never',
    label: 'Never',
    i18nKey: 'never',
  },
] as const

const expirationTimes = map(expirationTimesDefinitions, (role) => role.value)

export const ExpirationTime = z.enum(expirationTimes)
export type ExpirationTime = z.infer<typeof ExpirationTime>

export const getExpirationTime = (expirationTime: ExpirationTime) => {
  const definition = expirationTimesDefinitions.find(
    (r) => r.value === expirationTime,
  )
  if (!definition) {
    throw new Error(`Expiration time ${expirationTime} not found`)
  }
  return definition
}

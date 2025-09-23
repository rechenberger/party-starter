import { map } from 'remeda'
import { z } from 'zod'

export const expirationTimesDefinitions = [
  {
    value: '1d',
    i18nKey: 'oneDay',
  },
  {
    value: '1w',
    i18nKey: 'oneWeek',
  },
  {
    value: '1m',
    i18nKey: 'oneMonth',
  },
  {
    value: '1y',
    i18nKey: 'oneYear',
  },
  {
    value: 'never',
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

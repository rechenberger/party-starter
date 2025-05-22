import { map } from 'remeda'
import { z } from 'zod'

export const expirationTimesDefinitions = [
  {
    value: '1d',
    label: '1 day',
  },
  {
    value: '1w',
    label: '1 week',
  },
  {
    value: '1m',
    label: '1 month',
  },
  {
    value: '1y',
    label: '1 year',
  },
  {
    value: 'never',
    label: 'Never',
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

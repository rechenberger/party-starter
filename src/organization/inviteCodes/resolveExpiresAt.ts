import { addDays, addMonths, addYears } from 'date-fns'
import { ExpirationTime } from './expirationTimes'

export const resolveExpiresAt = (expirationTime: ExpirationTime) => {
  switch (expirationTime) {
    case 'never':
      return null
    case '1d':
      return addDays(new Date(), 1)
    case '1w':
      return addDays(new Date(), 7)
    case '1m':
      return addMonths(new Date(), 1)
    case '1y':
      return addYears(new Date(), 1)
    default:
      throw new Error('Invalid expires at')
  }
}

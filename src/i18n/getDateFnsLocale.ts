import { getMyLocale } from './getMyLocale'
import { getLocaleDefinition } from './locale'

export const getDateFnsLocale = async () => {
  const locale = await getMyLocale()
  return getLocaleDefinition(locale).dateFnsLocale
}

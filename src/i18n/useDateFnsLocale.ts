import { getLocaleDefinition } from './locale'
import { useLocale } from './useLocale'

export const useDateFnsLocale = () => {
  const locale = useLocale()
  return getLocaleDefinition(locale).dateFnsLocale
}

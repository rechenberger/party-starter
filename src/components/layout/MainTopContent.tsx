import { Locale } from '@/i18n/locale'
import { MainTopNavEntry } from './MainTopNavEntry'
import { getNavEntries } from './nav'

export const MainTopContent = async ({ locale }: { locale?: Locale }) => {
  const entries = await getNavEntries({ filter: 'landing', locale })

  return entries.map((entry) => (
    <MainTopNavEntry key={entry.href} entry={entry} />
  ))
}

import { MainTopNavEntry } from './MainTopNavEntry'
import { getNavEntries } from './nav'

export const MainTopContent = async () => {
  const entries = await getNavEntries({ filter: 'landing' })

  return entries.map((entry) => (
    <MainTopNavEntry key={entry.href} entry={entry} />
  ))
}

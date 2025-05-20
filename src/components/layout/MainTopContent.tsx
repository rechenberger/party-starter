import { MainTopNavEntries } from './MainTopNavEntries'
import { getNavEntries } from './nav'

export const MainTopContent = async () => {
  const entries = await getNavEntries({ filter: 'landing' })

  return <MainTopNavEntries entries={entries} />
}

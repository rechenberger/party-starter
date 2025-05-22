import { usePathname, useSearchParams } from 'next/navigation'
import { NavEntry } from './nav'

export const useNavEntryState = ({ entry }: { entry: NavEntry }) => {
  const url = new URL(entry.href, 'https://example.com') // any base url is fine
  const entryPathname = url.pathname

  const activePathname = usePathname()
  let isActive = entry.exactMatch
    ? activePathname === entryPathname
    : activePathname?.startsWith(entryPathname)

  const entrySearchParams = url.searchParams
  const activeSearchParams = useSearchParams()

  if (entrySearchParams.size > 0) {
    for (const [key, value] of entrySearchParams.entries()) {
      if (activeSearchParams.get(key) !== value) {
        isActive = false
      }
    }
  }

  if (entry.exactMatch && activeSearchParams.size !== entrySearchParams.size) {
    isActive = false
  }

  return { isActive }
}

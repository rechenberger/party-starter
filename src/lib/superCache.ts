import { revalidateTag } from 'next/cache'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'

const singleTag = (tag: string) => {
  return {
    key: tag,
    tag: () => cacheTag(tag),
    revalidate: () => revalidateTag(tag),
  }
}

export const superCache = {
  users: () => singleTag('users'),
  user: ({ id }: { id: string }) => singleTag(`users:${id}`),
  orgs: () => singleTag('orgs'),
  org: ({ id }: { id: string }) => singleTag(`orgs:${id}`),
}

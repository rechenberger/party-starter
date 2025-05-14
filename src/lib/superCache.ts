import { unstable_cacheTag as cacheTag, revalidateTag } from 'next/cache'

const ALL_TAG = 'all'

const singleTag = (tag: string, additionalTagsToRevalidate: string[] = []) => {
  const tags = [tag, ...additionalTagsToRevalidate]
  return {
    tag: () => {
      cacheTag(tag)
      cacheTag(ALL_TAG)
    },
    revalidate: () => {
      tags.forEach((tag) => revalidateTag(tag))
    },
  }
}

export const superCache = {
  all: () => singleTag(ALL_TAG),
  users: () => singleTag(`users`),
  user: ({ id }: { id: string }) => singleTag(`users:${id}`, [`users`]),
  orgs: () => singleTag(`orgs`),
  org: ({ id }: { id: string }) => singleTag(`orgs:${id}`, [`orgs`]),
}

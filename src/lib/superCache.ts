import { unstable_cacheTag as cacheTag, revalidateTag } from 'next/cache'

const singleTag = (tag: string, additionalTagsToRevalidate: string[] = []) => {
  const tags = [tag, ...additionalTagsToRevalidate]
  return {
    tag: () => cacheTag(tag),
    revalidate: () => tags.forEach((tag) => revalidateTag(tag)),
  }
}

export const superCache = {
  users: () => singleTag(`users`),
  user: ({ id }: { id: string }) => singleTag(`users:${id}`, [`users`]),
  orgs: () => singleTag(`orgs`),
  org: ({ id }: { id: string }) => singleTag(`orgs:${id}`, [`orgs`]),
}

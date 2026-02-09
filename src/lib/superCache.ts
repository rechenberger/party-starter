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
      tags.forEach((tag) => revalidateTag(tag, 'max'))
    },
  }
}

export const superCache = {
  all: () => singleTag(ALL_TAG),
  users: () => singleTag(`users`),
  user: ({ id }: { id: string }) => singleTag(`users:${id}`, [`users`]),
  orgs: () => singleTag(`orgs`),
  org: ({ id }: { id: string }) => singleTag(`org:${id}`, [`orgs`]),
  orgMembersAll: () => singleTag(`orgMembersAll`),
  orgMembers: ({ orgId }: { orgId: string }) =>
    singleTag(`orgMembers:${orgId}`, [`orgMembersAll`]),
  userOrgMemberships: ({ userId }: { userId: string }) =>
    singleTag(`userOrgMemberships:${userId}`, [`orgMembersAll`]),
}

import { convexApi, convexNext } from '@/auth/convex-next'

export type MyMembership = {
  id: string
  role: string
  organization: {
    id: string
    slug: string
    name: string
  }
}

export const getMemberships = async ({ userId }: { userId: string }) => {
  const memberships = (await convexNext.fetchAuthQuery(
    convexApi.organizations.myMemberships,
    {},
  )) as MyMembership[]

  return memberships.filter(
    (membership) => membership.organization.id && !!userId,
  )
}

export const getMyMemberships = async (): Promise<MyMembership[]> => {
  return (await convexNext.fetchAuthQuery(
    convexApi.organizations.myMemberships,
    {},
  )) as MyMembership[]
}

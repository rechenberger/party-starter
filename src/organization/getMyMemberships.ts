import { getMyUser } from '@/auth/getMyUser'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { superCache } from '@/lib/superCache'
import { eq } from 'drizzle-orm'

export const getMemberships = async ({ userId }: { userId: string }) => {
  'use cache'

  const memberships = await db.query.organizationMemberships.findMany({
    where: eq(schema.organizationMemberships.userId, userId),
    with: {
      organization: true,
    },
  })
  superCache.userOrgMemberships({ userId }).tag()
  for (const membership of memberships) {
    superCache.org({ id: membership.organization.id }).tag()
  }

  return memberships
}

export const getMyMemberships = async () => {
  const user = await getMyUser()

  if (!user) {
    return []
  }

  return getMemberships({ userId: user.id })
}

import { getMyUser } from '@/auth/getMyUser'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'

import { eq } from 'drizzle-orm'

export const getMyMemberships = async () => {
  const user = await getMyUser()

  if (!user) {
    return []
  }

  // TODO: Rename Table Stuff: No Table at the end
  const memberships = await db.query.organizationMemberships.findMany({
    where: eq(schema.organizationMemberships.userId, user.id),
    with: {
      organization: true,
    },
  })

  return memberships
}

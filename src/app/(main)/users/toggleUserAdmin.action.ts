'use server'

import { throwIfNotAdmin } from '@/auth/getIsAdmin'
import { db } from '@/db/db'
import { users as usersTable } from '@/db/schema-auth'
import { getTranslations } from '@/i18n/getTranslations'
import { superCache } from '@/lib/superCache'
import {
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { eq } from 'drizzle-orm'

export const toggleUserAdminAction = async ({
  userId,
  nextIsAdmin,
  email,
}: {
  userId: string
  nextIsAdmin: boolean
  email: string
}) => {
  return superAction(async () => {
    const t = await getTranslations()

    await throwIfNotAdmin({ allowDev: true })

    await db
      .update(usersTable)
      .set({ isAdmin: nextIsAdmin })
      .where(eq(usersTable.id, userId))

    superCache.user({ id: userId }).update()

    streamToast({
      title: nextIsAdmin ? t.users.madeAdmin : t.users.removedAdmin,
      description: nextIsAdmin
        ? t.users.makeAdminDescription(email)
        : t.users.removeAdminDescription(email),
    })
  })
}

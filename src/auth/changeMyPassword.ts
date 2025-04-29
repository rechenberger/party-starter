import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from './auth'

export const changeMyPassword = async ({
  userId,
  password,
}: {
  userId: string
  password: string
}) => {
  const existingPassword = await db.query.account.findFirst({
    where: and(
      eq(schema.account.userId, userId),
      eq(schema.account.providerId, 'credential'),
    ),
  })

  // Delete the existing password if it exists
  if (existingPassword) {
    await db
      .delete(schema.account)
      .where(eq(schema.account.id, existingPassword.id))
  }

  try {
    await auth.api.setPassword({
      body: {
        newPassword: password,
      },
      headers: await headers(),
    })
  } catch (error) {
    if (existingPassword) {
      // restore the existing password on fail
      await db.insert(schema.account).values(existingPassword)
    }
    throw error
  }
}

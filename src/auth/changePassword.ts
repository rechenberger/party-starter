import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { and, eq } from 'drizzle-orm'
import { hashPassword } from './password'

export const changePassword = async ({
  userId,
  password,
}: {
  userId: string
  password: string
}) => {
  const passwordHash = await hashPassword({ password })
  await db
    .update(schema.accounts)
    .set({
      password: passwordHash,
    })
    .where(
      and(
        eq(schema.accounts.userId, userId),
        eq(schema.accounts.providerId, 'credential'),
      ),
    )
    .execute()
}

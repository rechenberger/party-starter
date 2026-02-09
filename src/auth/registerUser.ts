import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { getTranslations } from '@/i18n/getTranslations'
import { superCache } from '@/lib/superCache'
import { first } from 'lodash-es'
import { Credentials } from './credentialsSchema'
import { hashPassword } from './password'

export const registerUser = async (credentials: Credentials) => {
  const t = await getTranslations()
  const existingUser = await db.query.users.findFirst({
    where: (s, { eq }) => eq(s.email, credentials.email),
  })
  if (existingUser) {
    throw new Error(t.auth.emailAlreadyTaken)
  }

  const passwordHash = await hashPassword({ password: credentials.password })

  const user = await db
    .insert(schema.users)
    .values({
      id: crypto.randomUUID(),
      email: credentials.email,
      passwordHash,
    })
    .returning({
      id: schema.users.id,
    })
    .then(first)

  if (!user) {
    throw new Error('Failed to register user')
  }

  superCache.user({ id: user.id }).update()
}

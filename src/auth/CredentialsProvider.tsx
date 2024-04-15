import { db } from '@/db/db'
import Credentials from '@auth/core/providers/credentials'
import bcrypt from 'bcrypt'
import { CredentialsSignin } from 'next-auth'
import { credentialsSchema } from './credentialsSchema'

export const CredentialsProvider = Credentials({
  credentials: {
    email: {},
    password: {},
  },
  authorize: async (credentialsRaw) => {
    const parsed = credentialsSchema.safeParse(credentialsRaw)
    if (!parsed.success) {
      throw new CredentialsSignin()
    }
    const credentials = parsed.data

    const user = await db.query.users.findFirst({
      where: (s, { eq, and, isNotNull }) =>
        and(eq(s.email, credentials.email), isNotNull(s.passwordHash)),
    })

    if (!user || !user.passwordHash) {
      throw new CredentialsSignin()
    }

    const correctPassword = await bcrypt.compare(
      credentials.password,
      user.passwordHash,
    )
    if (!correctPassword) {
      throw new CredentialsSignin()
    }

    return {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      image: user?.image,
    }
  },
})
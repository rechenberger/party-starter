import { db } from '@/db/db'
import { auth } from './betterAuth'
import { Credentials } from './credentialsSchema'

export const registerUser = async (credentials: Credentials) => {
  const existingUser = await db.query.user.findFirst({
    where: (s, { eq }) => eq(s.email, credentials.email),
  })
  if (existingUser) {
    throw new Error('Email already taken')
  }

  await auth.api.signUpEmail({
    body: {
      email: credentials.email,
      password: credentials.password,
      name: credentials.email,
    },
  })
}

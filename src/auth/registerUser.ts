import { getTranslations } from '@/i18n/getTranslations'
import { APIError } from 'better-auth/api'
import { headers } from 'next/headers'
import { auth } from './auth'
import { Credentials } from './credentialsSchema'

export const registerUser = async (credentials: Credentials) => {
  const t = await getTranslations()
  try {
    await auth.api.signUpEmail({
      body: {
        email: credentials.email,
        password: credentials.password,
        name: credentials.email,
        callbackURL: '/auth/login',
      },
      headers: await headers(),
    })
  } catch (error) {
    if (
      error instanceof APIError &&
      (error.body?.code === 'USER_ALREADY_EXISTS' ||
        error.body?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL')
    ) {
      throw new Error(t.auth.emailAlreadyTaken)
    }
    throw error
  }
}

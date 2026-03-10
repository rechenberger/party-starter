import { getTranslations } from '@/i18n/getTranslations'
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
      },
    })
  } catch (error: any) {
    const message = error?.message || error?.body?.message || ''
    if (
      message.includes('already exists') ||
      message.includes('already been taken')
    ) {
      throw new Error(t.auth.emailAlreadyTaken)
    }
    throw error
  }
}

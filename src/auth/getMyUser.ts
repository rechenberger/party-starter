import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { eq } from 'drizzle-orm'
import { omit } from 'lodash-es'
import { headers } from 'next/headers'
import { auth } from './auth'
import { loginWithRedirect } from './loginWithRedirect'

export const getMySession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

export const getMyUserId = async () => {
  const session = await getMySession()
  return session?.user?.id
}

export const getMyUserIdOrThrow = async () => {
  const userId = await getMyUserId()
  if (!userId) {
    throw new Error('User not found')
  }
  return userId
}

export const getIsLoggedIn = async () => {
  const userId = await getMyUserId()
  return !!userId
}

export const getMyUser = async () => {
  const userId = await getMyUserId()
  if (!userId) return null
  const user = await db.query.user.findFirst({
    where: eq(schema.user.id, userId),
  })
  const parsed = omit(user, ['passwordHash'])
  return parsed
}

export const getMyUserOrThrow = async () => {
  const user = await getMyUser()
  if (!user) throw new Error('User not found')
  return user
}

export const getMyUserOrLogin = async () => {
  const user = await getMyUser()
  if (!user) {
    await loginWithRedirect()
    throw new Error('User not found')
  }
  return user
}

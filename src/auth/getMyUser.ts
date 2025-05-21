import { db } from '@/db/db'
import { users } from '@/db/schema-auth'
import { superCache } from '@/lib/superCache'
import { eq } from 'drizzle-orm'
import { omit } from 'lodash-es'
import { auth } from './auth'
import { loginWithRedirect } from './loginWithRedirect'

export const getMyUserId = async () => {
  const session = await auth()
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

export const getUserById = async (id: string) => {
  'use cache'
  superCache.user({ id }).tag()

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  })
  if (!user) {
    return undefined
  }
  return omit(user, ['passwordHash'])
}

export const getMyUser = async () => {
  const userId = await getMyUserId()
  if (!userId) return undefined
  return getUserById(userId)
}

export const getMyUserOrThrow = async () => {
  const user = await getMyUser()
  if (!user) throw new Error('User not found')
  return user
}

export const getMyUserOrLogin = async ({
  forceRedirectUrl,
}: {
  forceRedirectUrl?: string
} = {}) => {
  const user = await getMyUser()
  if (!user) {
    await loginWithRedirect({ forceRedirectUrl })
    throw new Error('User not found')
  }
  return user
}

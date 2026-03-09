import { omit } from 'lodash-es'
import { convexApi, convexNext } from './convex-next'
import { loginWithRedirect } from './loginWithRedirect'

export const getMyUserId = async () => {
  const user = await getMyUser()
  return user?.id
}

export const getMyUserIdOrThrow = async () => {
  const userId = await getMyUserId()
  if (!userId) {
    throw new Error('User not found')
  }
  return userId
}

export const getIsLoggedIn = async () => {
  const user = await getMyUser()
  return !!user
}

export const getUserById = async (id: string) => {
  const users = await convexNext.fetchAuthQuery(convexApi.users.list, {})
  const user = users.find((entry: any) => entry.id === id)
  if (!user) {
    return undefined
  }
  return omit(user, ['passwordHash', 'providers'])
}

export const getMyUser = async () => {
  const user = await convexNext.fetchAuthQuery(convexApi.auth.currentUser, {})
  return user ?? undefined
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

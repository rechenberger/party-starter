import { omit } from 'lodash-es'
import { convexApi, convexNext } from './convex-next'
import { loginWithRedirect } from './loginWithRedirect'

export type AppUser = {
  id: string
  name: string | null
  email: string
  image: string | null
  emailVerified: boolean
  role: string
  isAdmin: boolean
  actorUserId: string
  effectiveUserId: string
  isImpersonating: boolean
  actor: {
    id: string
    name: string | null
    email: string
    image: string | null
    emailVerified: boolean
    role: string
    isAdmin: boolean
  } | null
}

const normalizeActor = (actor: any): AppUser['actor'] => {
  if (!actor) {
    return null
  }

  return {
    id: `${actor.id ?? ''}`,
    name: actor.name ?? null,
    email: `${actor.email ?? ''}`,
    image: actor.image ?? null,
    emailVerified: !!actor.emailVerified,
    role: `${actor.role ?? 'user'}`,
    isAdmin: !!actor.isAdmin,
  }
}

const normalizeUser = (user: any): AppUser => ({
  id: `${user.id ?? ''}`,
  name: user.name ?? null,
  email: `${user.email ?? ''}`,
  image: user.image ?? null,
  emailVerified: !!user.emailVerified,
  role: `${user.role ?? 'user'}`,
  isAdmin: !!user.isAdmin,
  actorUserId: `${user.actorUserId ?? user.id ?? ''}`,
  effectiveUserId: `${user.effectiveUserId ?? user.id ?? ''}`,
  isImpersonating: !!user.isImpersonating,
  actor: normalizeActor(user.actor),
})

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
  return normalizeUser(omit(user, ['passwordHash', 'providers']))
}

export const getMyUser = async (): Promise<AppUser | undefined> => {
  const user = await convexNext.fetchAuthQuery(convexApi.auth.currentUser, {})
  return user ? normalizeUser(user) : undefined
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

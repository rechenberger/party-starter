import { createApi, createClient } from '@convex-dev/better-auth'
import { getAuthConfigProvider } from '@convex-dev/better-auth/auth-config'
import { convex as convexPlugin } from '@convex-dev/better-auth/plugins'
import { ConvexError } from 'convex/values'
import { betterAuth } from 'better-auth'
import { admin } from 'better-auth/plugins'
import { query } from './_generated/server'
import schema from './schema'

const getAppUrl = () => {
  if (process.env.SITE_URL?.trim()) return process.env.SITE_URL.trim()
  if (process.env.BASE_URL?.trim()) return process.env.BASE_URL.trim()
  if (process.env.VERCEL_URL?.trim()) return `https://${process.env.VERCEL_URL}`
  return 'http://127.0.0.1:3000'
}

const sendAuthEmail = async ({
  template,
  to,
  url,
}: {
  template: 'verify-email' | 'reset-password'
  to: string
  url: string
}) => {
  const response = await fetch(`${getAppUrl()}/api/internal/auth-mail`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-auth-secret': process.env.AUTH_SECRET ?? '',
    },
    body: JSON.stringify({ template, to, url }),
  })

  if (!response.ok) {
    throw new Error(`Failed to dispatch auth email: ${response.status}`)
  }
}

export const authConfig = {
  providers: [getAuthConfigProvider()],
}

const buildSocialProviders = () => {
  if (
    !process.env.AUTH_DISCORD_ID?.trim() ||
    !process.env.AUTH_DISCORD_SECRET?.trim()
  ) {
    return undefined
  }

  return {
    discord: {
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
    },
  }
}

export const createAuthOptions = (ctx: any): any => {
  const database = ctx?.db ? authComponent.adapter(ctx) : undefined

  return {
    ...(database ? { database } : {}),
    baseURL: getAppUrl(),
    basePath: '/api/auth',
    trustedOrigins: [getAppUrl()],
    secret: process.env.AUTH_SECRET,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      async sendResetPassword({ user, url }: any) {
        await sendAuthEmail({
          template: 'reset-password',
          to: user.email,
          url,
        })
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      async sendVerificationEmail({ user, url }: any) {
        await sendAuthEmail({
          template: 'verify-email',
          to: user.email,
          url,
        })
      },
    },
    socialProviders: buildSocialProviders(),
    plugins: [
      admin({
        defaultRole: 'user',
        adminRoles: ['admin'],
        impersonationSessionDuration: 60 * 60,
      }),
      convexPlugin({
        authConfig,
        options: {
          basePath: '/api/auth',
        },
      }),
    ],
  }
}

export const authApi: any = createApi(schema, createAuthOptions)

export const authComponent: any = createClient(authApi, {
  local: { schema },
})

export const createAuth = (ctx: any) => betterAuth(createAuthOptions(ctx))

export const { getAuthUser } = authComponent.clientApi()

const toPublicUser = (user: any) => {
  if (!user) return null

  return {
    id: `${user._id}`,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    emailVerified: !!user.emailVerified,
    role: user.role ?? 'user',
    isAdmin: user.role === 'admin',
  }
}

export const getViewer = async (ctx: any) => {
  const user = await authComponent.safeGetAuthUser(ctx)
  if (!user) {
    return null
  }

  const identity = await ctx.auth.getUserIdentity()
  const session = identity?.sessionId
    ? await ctx.runQuery(authApi.findOne, {
        model: 'session',
        where: [{ field: '_id', value: identity.sessionId as string }],
      })
    : null

  const actorUser = session?.impersonatedBy
    ? await ctx.runQuery(authApi.findOne, {
        model: 'user',
        where: [{ field: '_id', value: session.impersonatedBy }],
      })
    : user

  return {
    user,
    actorUser,
    session,
    publicUser: toPublicUser(user),
    publicActor: toPublicUser(actorUser),
    effectiveUserId: `${user._id}`,
    actorUserId: session?.impersonatedBy ?? `${user._id}`,
    isImpersonating: !!session?.impersonatedBy,
  }
}

export const requireViewer = async (ctx: any) => {
  const viewer = await getViewer(ctx)
  if (!viewer) {
    throw new ConvexError('Unauthenticated')
  }
  return viewer
}

export const requireAdminViewer = async (ctx: any) => {
  const viewer = await requireViewer(ctx)
  if (viewer.publicActor?.role !== 'admin') {
    throw new ConvexError('Forbidden')
  }
  return viewer
}

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await getViewer(ctx)
    if (!viewer) return null

    return {
      ...viewer.publicUser,
      actorUserId: viewer.actorUserId,
      effectiveUserId: viewer.effectiveUserId,
      isImpersonating: viewer.isImpersonating,
      actor: viewer.publicActor,
    }
  },
})

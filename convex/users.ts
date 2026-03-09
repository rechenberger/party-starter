import { ConvexError } from 'convex/values'
import { mutation, query } from './_generated/server'
import {
  createAuth,
  authComponent,
  authApi,
  requireAdminViewer,
  requireViewer,
} from './auth'

const toPublicUser = (user: any, providers: string[]) => ({
  id: `${user._id}`,
  name: user.name,
  email: user.email,
  image: user.image ?? null,
  emailVerified: !!user.emailVerified,
  role: user.role ?? 'user',
  isAdmin: user.role === 'admin',
  providers,
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminViewer(ctx)

    const users = await ctx.db.query('user').collect()
    const accounts = await ctx.db.query('account').collect()

    return users
      .map((user) => {
        const providers = accounts
          .filter((account) => account.userId === `${user._id}`)
          .map((account) => account.providerId)

        return toPublicUser(user, providers)
      })
      .sort((a, b) => a.email.localeCompare(b.email))
  },
})

export const setRole = mutation({
  args: {
    userId: null as any,
    role: null as any,
  },
  handler: async (ctx, args) => {
    await requireAdminViewer(ctx)

    const user = await ctx.runQuery(authApi.findOne, {
      model: 'user',
      where: [{ field: '_id', value: args.userId as string }],
    })

    if (!user?._id) {
      throw new ConvexError('User not found')
    }

    await ctx.db.patch(user._id, { role: args.role })
    return { ok: true }
  },
})

export const impersonate = mutation({
  args: {
    userId: null as any,
  },
  handler: async (ctx, args) => {
    await requireAdminViewer(ctx)

    const { auth, headers } = await authComponent.getAuth(createAuth, ctx)
    await auth.api.impersonateUser({
      body: { userId: args.userId as string },
      headers,
    })

    return { ok: true }
  },
})

export const stopImpersonation = mutation({
  args: {},
  handler: async (ctx) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx)
    await auth.api.stopImpersonating({
      headers,
    })
    return { ok: true }
  },
})

export const setOwnPassword = mutation({
  args: {
    newPassword: null as any,
  },
  handler: async (ctx, args) => {
    await requireViewer(ctx)
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx)
    await auth.api.setPassword({
      body: {
        newPassword: `${args.newPassword}`,
      },
      headers,
    })
    return { ok: true }
  },
})

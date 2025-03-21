// FROM: https://github.com/better-auth/better-auth/blob/main/packages/better-auth/src/plugins/admin/admin.ts#L760 (impersonateUser endpoint)

import { BetterAuthPlugin } from 'better-auth'
import { APIError, createAuthEndpoint } from 'better-auth/api'
import { deleteSessionCookie, setSessionCookie } from 'better-auth/cookies'
import { z } from 'zod'
import { throwIfNotAdmin } from './getIsAdmin'

export const loginAsPlugin = () => {
  return {
    id: 'login-as',
    endpoints: {
      loginAsUser: createAuthEndpoint(
        '/login-as/impersonate-user',
        {
          method: 'POST',
          body: z.object({
            userId: z.string({
              description: 'The user id',
            }),
          }),
        },
        async (ctx) => {
          await throwIfNotAdmin({ allowDev: true })
          const targetUser = await ctx.context.internalAdapter.findUserById(
            ctx.body.userId,
          )

          if (!targetUser) {
            throw new APIError('NOT_FOUND', {
              message: 'User not found',
            })
          }

          const session = await ctx.context.internalAdapter.createSession(
            targetUser.id,
            undefined,
            true,
            {},
            ctx,
            true,
          )
          if (!session) {
            throw new APIError('INTERNAL_SERVER_ERROR', {
              message: 'Failed to create session',
            })
          }
          const authCookies = ctx.context.authCookies
          deleteSessionCookie(ctx)
          await ctx.setSignedCookie(
            'admin_session',
            session.token,
            ctx.context.secret,
            authCookies.sessionToken.options,
          )
          await setSessionCookie(
            ctx,
            {
              session: session,
              user: targetUser,
            },
            true,
          )
          return ctx.json({
            session: session,
            user: targetUser,
          })
        },
      ),
    },
  } satisfies BetterAuthPlugin
}

import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { verifyEmailEmail } from '@/emails/VerifyEmail'
import { BASE_URL } from '@/lib/config'
import { superCache } from '@/lib/superCache'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins/admin'
import { betterAuth } from 'better-auth'
import { toNextJsHandler } from 'better-auth/next-js'
import { comparePasswords, hashPassword } from './password'

const authSchema = {
  user: schema.users,
  account: schema.accounts,
  session: schema.sessions,
  verification: schema.verifications,
}

const getOriginFromUrl = (value?: string | null) => {
  if (!value) return undefined
  try {
    return new URL(value).origin
  } catch {
    return undefined
  }
}

const revalidateUserCache = (userId?: string | null) => {
  if (userId) {
    superCache.user({ id: userId }).revalidate()
  }
  superCache.users().revalidate()
}

export const auth = betterAuth({
  baseURL: BASE_URL,
  secret: process.env.AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),
  trustedOrigins: async (request) => {
    return [
      BASE_URL,
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      request?.headers.get('origin'),
      getOriginFromUrl(request?.headers.get('referer')),
    ].filter((value): value is string => !!value)
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await verifyEmailEmail.send({
        props: { verifyUrl: url },
        to: user.email,
      })
    },
    password: {
      hash: async (password) => hashPassword({ password }),
      verify: async ({ hash, password }) =>
        comparePasswords({ hash, password }),
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: false,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }) => {
      await verifyEmailEmail.send({
        props: { verifyUrl: url },
        to: user.email,
      })
    },
    afterEmailVerification: async (user) => {
      revalidateUserCache(user.id)
    },
  },
  socialProviders:
    process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET
      ? {
          discord: {
            clientId: process.env.AUTH_DISCORD_ID,
            clientSecret: process.env.AUTH_DISCORD_SECRET,
          },
        }
      : undefined,
  user: {
    additionalFields: {
      isAdmin: {
        type: 'boolean',
        defaultValue: false,
        input: false,
        fieldName: 'isAdmin',
      },
    },
  },
  plugins: [
    nextCookies(),
    admin({
      allowImpersonatingAdmins: true,
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          revalidateUserCache(user.id as string | undefined)
        },
      },
      update: {
        after: async (user) => {
          revalidateUserCache(user.id as string | undefined)
        },
      },
      delete: {
        after: async (user) => {
          revalidateUserCache(user.id as string | undefined)
        },
      },
    },
  },
})

export const handlers = toNextJsHandler(auth)

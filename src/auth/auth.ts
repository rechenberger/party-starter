import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { verifyEmailEmail } from '@/emails/VerifyEmail'
import { superCache } from '@/lib/superCache'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { admin, magicLink } from 'better-auth/plugins'
import { hashPassword, comparePasswords } from './password'

export const auth = betterAuth({
  secret: process.env.AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    usePlural: true,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    password: {
      hash: (password) => hashPassword({ password }),
      verify: ({ password, hash }) => comparePasswords({ password, hash }),
    },
    sendResetPassword: async ({ user, url }) => {
      await verifyEmailEmail.send({
        props: { verifyUrl: url },
        to: user.email,
      })
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await verifyEmailEmail.send({
        props: { verifyUrl: url },
        to: user.email,
      })
    },
    sendOnSignUp: true,
  },

  socialProviders: {
    discord: {
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
    },
  },

  plugins: [
    admin(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await verifyEmailEmail.send({
          props: { verifyUrl: url },
          to: email,
        })
      },
    }),
    nextCookies(),
  ],

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  user: {
    changeEmail: {
      enabled: false,
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          superCache.user({ id: user.id }).revalidate()
        },
      },
      update: {
        after: async (user) => {
          superCache.user({ id: user.id }).revalidate()
        },
      },
    },
    account: {
      create: {
        after: async (account) => {
          superCache.user({ id: account.userId }).revalidate()
        },
      },
    },
  },
})

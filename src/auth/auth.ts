import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { impersonatePlugin } from './impersonatePlugin'
import { sendVerificationRequestEmail } from './sendVerificationRequestEmail'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async (data) => {},
  },
  emailVerification: {
    sendVerificationEmail: async (data) => {
      await sendVerificationRequestEmail({
        email: data.user.email,
        url: data.url,
      })
    },
  },
  socialProviders: {
    discord: {
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
    },
  },
  plugins: [impersonatePlugin(), nextCookies()],
})

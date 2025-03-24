import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { impersonatePlugin } from './impersonatePlugin'
import { sendEmail } from './sendEmail'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async (data) => {
      await sendEmail({
        email: data.user.email,
        url: data.url,
        template: 'resetPassword',
      })
    },
  },
  emailVerification: {
    sendVerificationEmail: async (data) => {
      await sendEmail({
        email: data.user.email,
        url: data.url,
        template: 'verify',
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

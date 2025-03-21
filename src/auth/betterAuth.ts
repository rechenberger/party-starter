import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    discord: {
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
    },
  },
  session: {
    fields: {
      expiresAt: 'expires', // e.g., "expires_at" or your existing field name
      token: 'sessionToken', // e.g., "session_token" or your existing field name
    },
  },
  accounts: {
    fields: {
      accountId: 'providerAccountId',
      refreshToken: 'refresh_token',
      accessToken: 'access_token',
      accessTokenExpiresAt: 'access_token_expires',
      idToken: 'id_token',
    },
  },
})

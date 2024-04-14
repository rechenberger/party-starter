import { db } from '@/db/db'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'
import Passkey from 'next-auth/providers/passkey'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db), // TODO: Passkey does not work with DrizzleAdapter, yet 😥
  providers: [Discord, Passkey],
  experimental: { enableWebAuthn: true },
})

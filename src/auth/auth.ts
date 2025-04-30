import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import Nodemailer from '@auth/core/providers/nodemailer'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { and, eq, lt } from 'drizzle-orm'
import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'
import { CredentialsProvider } from './CredentialsProvider'
import { ImpersonateProvider } from './ImpersonateProvider'
import { sendVerificationRequestEmail } from './sendVerificationRequestEmail'

const hasEmailEnvVars = !!process.env.EMAIL_FROM && !!process.env.SMTP_URL

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: {
    ...DrizzleAdapter(db),
    useVerificationToken: async (params) => {
      const { identifier, token } = params

      // Cleanup - delete all expired tokens first
      await db
        .delete(schema.verificationTokens)
        .where(lt(schema.verificationTokens.expires, new Date()))

      const [verificationToken] = await db
        .select()
        .from(schema.verificationTokens)
        .where(
          and(
            eq(schema.verificationTokens.identifier, identifier),
            eq(schema.verificationTokens.token, token),
          ),
        )
        .limit(1)

      if (!verificationToken) {
        return null
      }

      return {
        token: verificationToken.token,
        identifier: verificationToken.identifier,
        expires: verificationToken.expires,
      }
    },
  },

  pages: {
    signIn: '/auth/login',
  },
  providers: [
    Discord,
    ...((hasEmailEnvVars
      ? [
          Nodemailer({
            from: process.env.EMAIL_FROM,
            server: process.env.SMTP_URL,

            sendVerificationRequest: async (params) => {
              await sendVerificationRequestEmail({
                ...params,
              })
            },
          }),
        ]
      : []) as any), // TODO: FIXME: looks like a type bug in next-auth
    CredentialsProvider,
    ImpersonateProvider,
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string
      }
      return session
    },
  },
})

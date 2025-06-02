import { db } from '@/db/db'
import { superCache } from '@/lib/superCache'
import Nodemailer from '@auth/core/providers/nodemailer'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { verifyEmailEmail } from '@emails/VerifyEmail'
import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'
import { headers } from 'next/headers'
import { CredentialsProvider } from './CredentialsProvider'
import { ImpersonateProvider } from './ImpersonateProvider'

const hasEmailEnvVars = !!process.env.EMAIL_FROM && !!process.env.SMTP_URL

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: `/auth/login`,
    verifyRequest: `/auth/check-mail`,
  },
  providers: [
    Discord,
    ...((hasEmailEnvVars
      ? [
          Nodemailer({
            from: process.env.EMAIL_FROM,
            server: process.env.SMTP_URL,

            sendVerificationRequest: async (params) => {
              const h = await headers()
              const baseUrl = h.get('Origin')

              const url = `${baseUrl}/auth/verify-email?redirect=${encodeURIComponent(
                params.url,
              )}`

              await verifyEmailEmail.send({
                props: { verifyUrl: url },
                to: params.identifier,
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
  events: {
    createUser: ({ user }) => {
      if (user.id) {
        superCache.user({ id: user.id }).revalidate()
      } else {
        superCache.users().revalidate()
      }
    },
    linkAccount: ({ user }) => {
      if (user.id) {
        superCache.user({ id: user.id }).revalidate()
      } else {
        superCache.users().revalidate()
      }
    },
    updateUser: ({ user }) => {
      if (user.id) {
        superCache.user({ id: user.id }).revalidate()
      } else {
        superCache.users().revalidate()
      }
    },
  },
})

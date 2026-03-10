import { getTranslations } from '@/i18n/getTranslations'
import {
  streamDialog,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { APIError } from 'better-auth/api'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginFormClient } from './LoginFormClient'
import { auth } from './auth'
import { registerUser } from './registerUser'

export const LoginForm = async ({ redirectUrl }: { redirectUrl?: string }) => {
  const t = await getTranslations()
  return (
    <>
      <LoginFormClient
        action={async (data) => {
          'use server'
          return superAction(async () => {
            const t = await getTranslations()
            if (data.type === 'login') {
              try {
                const result = await auth.api.signInEmail({
                  body: {
                    email: data.email,
                    password: data.password,
                    callbackURL: redirectUrl || '/',
                  },
                  headers: await headers(),
                })
                streamDialog(null)
                redirect(result.url || redirectUrl || '/')
              } catch (error) {
                if (
                  error instanceof APIError &&
                  error.body?.code === 'INVALID_EMAIL_OR_PASSWORD'
                ) {
                  throw new Error(t.auth.invalidCredentials)
                }

                if (
                  error instanceof APIError &&
                  error.body?.code === 'EMAIL_NOT_VERIFIED'
                ) {
                  streamDialog({
                    title: t.auth.emailNotVerifiedTitle,
                    content: t.auth.resendVerifyMailDescription(data.email),
                  })
                  await auth.api.sendVerificationEmail({
                    body: {
                      email: data.email,
                      callbackURL: redirectUrl || '/auth/login',
                    },
                    headers: await headers(),
                  })
                  return
                }

                throw error
              }
            } else if (data.type === 'register') {
              await registerUser(data)
              streamDialog(null)
              redirect('/auth/check-mail')
            } else if (data.type === 'forgotPassword') {
              let redirectTo = '/auth/change-password'
              if (redirectUrl) {
                redirectTo += `?redirect=${encodeURIComponent(redirectUrl)}`
              }
              await auth.api.requestPasswordReset({
                body: {
                  email: data.email,
                  redirectTo,
                },
                headers: await headers(),
              })
              streamDialog(null)
              redirect('/auth/check-mail')
            } else {
              const exhaustiveCheck: never = data
              return exhaustiveCheck
            }
          })
        }}
        alternatives={
          <>
            <ActionButton
              variant={'outline'}
              action={async () => {
                'use server'
                const result = await auth.api.signInSocial({
                  body: {
                    provider: 'discord',
                    callbackURL: redirectUrl || '/',
                  },
                  headers: await headers(),
                })
                streamDialog(null)
                redirect(result.url || redirectUrl || '/')
              }}
            >
              {t.auth.continueWithDiscord}
            </ActionButton>
          </>
        }
      />
    </>
  )
}

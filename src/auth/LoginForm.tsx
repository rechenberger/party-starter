import { getTranslations } from '@/i18n/getTranslations'
import {
  streamDialog,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
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
              // LOGIN
              try {
                await auth.api.signInEmail({
                  body: {
                    email: data.email,
                    password: data.password,
                  },
                  headers: await headers(),
                })
              } catch (error: any) {
                const message = error?.message || error?.body?.message || ''
                if (
                  message.includes('email is not verified') ||
                  message.includes('Email is not verified')
                ) {
                  streamDialog({
                    title: t.auth.emailNotVerifiedTitle,
                    content: t.auth.resendVerifyMailDescription(data.email),
                  })
                  await auth.api.sendVerificationEmail({
                    body: {
                      email: data.email,
                      callbackURL: redirectUrl || '/app',
                    },
                  })
                } else {
                  throw new Error(t.auth.invalidCredentials)
                }
              }
              return
            } else if (data.type === 'register') {
              // REGISTER
              await registerUser(data)
              redirect('/auth/check-mail')
            } else if (data.type === 'forgotPassword') {
              // FORGOT PASSWORD
              let callbackURL = '/auth/change-password'
              if (redirectUrl) {
                callbackURL += `?redirect=${encodeURIComponent(redirectUrl)}`
              }
              await auth.api.requestPasswordReset({
                body: {
                  email: data.email,
                  redirectTo: callbackURL,
                },
              })
              redirect('/auth/check-mail')
            } else {
              const exhaustiveCheck: never = data
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
                    callbackURL: redirectUrl || '/app',
                  },
                  headers: await headers(),
                })
                if (result?.url) {
                  const { redirect } = await import('next/navigation')
                  redirect(result.url)
                }
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

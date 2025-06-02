import { getTranslations } from '@/i18n/getTranslations'
import {
  streamDialog,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { CredentialsSignin } from 'next-auth'
import { EmailNotVerifiedAuthorizeError } from './CredentialsProvider'
import { LoginFormClient } from './LoginFormClient'
import { signIn } from './auth'
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
                await signIn('credentials', data)
              } catch (error) {
                if (error instanceof CredentialsSignin) {
                  throw new Error('Invalid credentials')
                } else if (error instanceof EmailNotVerifiedAuthorizeError) {
                  streamDialog({
                    title: t.auth.emailNotVerifiedTitle,
                    content: t.auth.resendVerifyMailDescription(data.email),
                  })
                  await signIn('nodemailer', {
                    email: data.email,
                    redirect: false,
                  })
                } else {
                  throw error
                }
              }
              return
            } else if (data.type === 'register') {
              // REGISTER
              await registerUser(data)
              await signIn('nodemailer', data)
            } else if (data.type === 'forgotPassword') {
              // CHANGE PASSWORD
              let redirectTo = '/auth/change-password'
              if (redirectUrl) {
                redirectTo += `?redirect=${encodeURIComponent(redirectUrl)}`
              }
              await signIn('nodemailer', {
                email: data.email,
                redirectTo,
              })
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
                await signIn('discord')
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

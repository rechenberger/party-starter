import { superAction } from '@/super-action/action/createSuperAction'
import { redirect } from 'next/navigation'
import { LoginFormClient } from './LoginFormClient'
import { LoginSocial } from './LoginSocial'
import { auth } from './auth'

export const LoginForm = ({ redirectUrl }: { redirectUrl?: string }) => {
  return (
    <>
      <LoginFormClient
        action={async (data) => {
          'use server'
          return superAction(async () => {
            if (data.type === 'login') {
              // LOGIN
              await auth.api.signInEmail({
                body: {
                  email: data.email,
                  password: data.password,
                  callbackURL: redirectUrl,
                },
              })
              if (redirectUrl) {
                redirect(redirectUrl)
              }
            } else if (data.type === 'register') {
              // REGISTER
              await auth.api.signUpEmail({
                body: {
                  email: data.email,
                  password: data.password,
                  name: data.email,
                  callbackURL: redirectUrl,
                },
              })
              if (redirectUrl) {
                redirect(redirectUrl)
              }
            } else if (data.type === 'forgotPassword') {
              // FORGOT PASSWORD
              let redirectTo = '/auth/change-password'
              if (redirectUrl) {
                redirectTo += `?redirect=${encodeURIComponent(redirectUrl)}`
              }
              // await signIn('nodemailer', {
              //   email: data.email,
              //   redirectTo,
              // })
              throw new Error('TODO: forgot password')
            } else {
              const exhaustiveCheck: never = data
            }
          })
        }}
        alternatives={
          <>
            <LoginSocial />
            {/* <ActionButton
              variant={'outline'}
              action={async () => {
                'use server'
                await signIn()
              }}
            >
              Sign in Page
            </ActionButton> */}
          </>
        }
      />
    </>
  )
}

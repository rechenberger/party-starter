'use client'

import { LoginFormClient } from './LoginFormClient'
import { LoginSocial } from './LoginSocial'
import { authClient, signIn } from './betterAuthClient'

export const LoginForm = ({ redirectUrl }: { redirectUrl?: string }) => {
  return (
    <>
      <LoginFormClient
        action={async (data) => {
          if (data.type === 'login') {
            // LOGIN
            await signIn.email({
              email: data.email,
              password: data.password,
              callbackURL: redirectUrl,
            })
          } else if (data.type === 'register') {
            // REGISTER
            await authClient.signUp.email({
              email: data.email,
              password: data.password,
              name: data.email,
              callbackURL: redirectUrl,
            })
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

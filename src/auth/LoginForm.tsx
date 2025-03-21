import {
  streamDialog,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { CredentialsSignin } from 'next-auth'
import { EmailNotVerifiedAuthorizeError } from './CredentialsProvider'
import { LoginFormClient } from './LoginFormClient'
import { auth } from './betterAuth'
import { signIn } from './betterAuthClient'
import { registerUser } from './registerUser'

export const LoginForm = ({ redirectUrl }: { redirectUrl?: string }) => {
  return (
    <>
      <LoginFormClient
        action={async (data) => {
          'use server'
          return superAction(async () => {
            if (data.type === 'login') {
              // LOGIN
              try {
                await signIn.email({
                  email: data.email,
                  password: data.password,
                })
              } catch (error) {
                if (error instanceof CredentialsSignin) {
                  throw new Error('Invalid credentials')
                } else if (error instanceof EmailNotVerifiedAuthorizeError) {
                  // throw new Error('Email not verified')
                  streamDialog({
                    title: 'Email not verified',
                    content: (
                      <>
                        <p>
                          We sent you another verification email to
                          {data.email}.
                        </p>
                        <p>
                          Please open the email and click sign in to verify your
                          email.
                        </p>
                      </>
                    ),
                  })
                  // await signIn('nodemailer', {
                  //   email: data.email,
                  //   redirect: false,
                  // })
                  throw new Error('TODO: send verification email')
                } else {
                  throw error
                }
              }
              return
            } else if (data.type === 'register') {
              // REGISTER
              await registerUser(data)
              // await signIn('nodemailer', data)
              throw new Error('TODO: signup')
            } else if (data.type === 'forgotPassword') {
              // CHANGE PASSWORD
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
            <ActionButton
              variant={'outline'}
              action={async () => {
                'use server'
                await auth.api.signInSocial({
                  body: {
                    provider: 'discord',
                  },
                })
                // await signIn.social({
                //   provider: 'discord',
                // })
              }}
            >
              Continue with Discord
            </ActionButton>
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

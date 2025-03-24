import {
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { redirect } from 'next/navigation'
import { ChangePasswordFormClient } from './ChangePasswordFormClient'
import { authClient } from './betterAuthClient'
import { changePassword } from './changePassword'
import { getMyUser, getMyUserIdOrThrow } from './getMyUser'

export const ChangePasswordForm = async (props: {
  redirectUrl?: string
  variant: 'reset' | 'change'
  token?: string
}) => {
  const user = await getMyUser()
  return (
    <>
      <ChangePasswordFormClient
        action={async (data) => {
          'use server'
          const { redirectUrl, variant, token } = props
          return superAction(async () => {
            if (variant === 'change') {
              const userId = await getMyUserIdOrThrow()
              await changePassword({
                password: data.password,
                userId,
              })

              const description = redirectUrl
                ? 'Redirecting...'
                : 'Your password has been changed'

              streamToast({
                title: 'Password Changed!',
                description,
              })
            } else if (variant === 'reset') {
              await authClient.resetPassword({
                newPassword: data.password,
                token,
              })
            } else {
              const _exhaustiveCheck: never = variant
            }

            if (redirectUrl) {
              await new Promise((res) => setTimeout(res, 2000))
            }
            redirect(redirectUrl || '/')
          })
        }}
        email={user?.email}
        redirectUrl={props.redirectUrl}
      />
    </>
  )
}

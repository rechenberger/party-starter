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
          return changePasswordAction({
            ...props,
            newPassword: data.password,
          })
        }}
        email={user?.email}
        redirectUrl={props.redirectUrl}
      />
    </>
  )
}

const changePasswordAction = ({
  redirectUrl,
  variant,
  token,
  newPassword,
}: {
  redirectUrl?: string
  variant: 'reset' | 'change'
  token?: string
  newPassword: string
}) => {
  return superAction(async () => {
    if (variant === 'change') {
      const userId = await getMyUserIdOrThrow()
      await changePassword({
        password: newPassword,
        userId,
      })
    } else if (variant === 'reset') {
      const result = await authClient.resetPassword({
        newPassword,
        token,
      })
      if (result.error) {
        throw result.error
      }
      if (!redirectUrl) {
        redirectUrl = '/'
      }
    } else {
      const _exhaustiveCheck: never = variant
    }

    const description = redirectUrl
      ? 'Redirecting...'
      : 'Your password has been changed'

    streamToast({
      title: 'Password Changed!',
      description,
    })

    if (redirectUrl) {
      await new Promise((res) => setTimeout(res, 2000))
      redirect(redirectUrl)
    }
  })
}

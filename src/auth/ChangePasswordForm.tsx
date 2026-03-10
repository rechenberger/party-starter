import { getTranslations } from '@/i18n/getTranslations'
import { superCache } from '@/lib/superCache'
import {
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from './auth'
import { ChangePasswordFormClient } from './ChangePasswordFormClient'
import { getMyUser, getMyUserIdOrThrow } from './getMyUser'

export const ChangePasswordForm = async ({
  redirectUrl,
  token,
}: {
  redirectUrl?: string
  token?: string
}) => {
  const user = token ? undefined : await getMyUser()
  return (
    <>
      <ChangePasswordFormClient
        action={async (data) => {
          'use server'
          return superAction(async () => {
            const t = await getTranslations()
            let successRedirect = '/'

            if (token) {
              await auth.api.resetPassword({
                body: {
                  newPassword: data.password,
                  token,
                },
                headers: await headers(),
              })
              successRedirect = redirectUrl
                ? `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`
                : '/auth/login'
            } else {
              const currentPassword = data.currentPassword?.trim()
              if (!currentPassword) {
                throw new Error(t.auth.currentPasswordRequired)
              }

              const userId = await getMyUserIdOrThrow()
              await auth.api.changePassword({
                body: {
                  currentPassword,
                  newPassword: data.password,
                },
                headers: await headers(),
              })
              superCache.user({ id: userId }).update()
              successRedirect = redirectUrl || '/'
            }

            const description =
              redirectUrl || token ? t.standardWords.redirecting : undefined

            streamToast({
              title: t.userManagement.passwordChanged,
              description,
            })

            if (redirectUrl || token) {
              await new Promise((res) => setTimeout(res, 2000))
            }
            redirect(successRedirect)
          })
        }}
        email={user?.email}
        redirectUrl={redirectUrl}
        requiresCurrentPassword={!token}
      />
    </>
  )
}

import { getTranslations } from '@/i18n/getTranslations'
import { superCache } from '@/lib/superCache'
import {
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { redirect } from 'next/navigation'
import { ChangePasswordFormClient } from './ChangePasswordFormClient'
import { changePassword } from './changePassword'
import { getMyUser, getMyUserIdOrThrow } from './getMyUser'

export const ChangePasswordForm = async ({
  redirectUrl,
}: {
  redirectUrl?: string
}) => {
  const user = await getMyUser()
  return (
    <>
      <ChangePasswordFormClient
        action={async (data) => {
          'use server'
          return superAction(async () => {
            const t = await getTranslations()
            const userId = await getMyUserIdOrThrow()
            await changePassword({
              password: data.password,
              userId,
            })

            const description = redirectUrl
              ? t.standardWords.redirecting
              : undefined

            superCache.user({ id: userId }).update()

            streamToast({
              title: t.userManagement.passwordChanged,
              description,
            })

            if (redirectUrl) {
              await new Promise((res) => setTimeout(res, 2000))
            }
            redirect(redirectUrl || '/')
          })
        }}
        email={user?.email}
        redirectUrl={redirectUrl}
      />
    </>
  )
}

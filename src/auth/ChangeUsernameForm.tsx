import { db } from '@/db/db'
import { getTranslations } from '@/i18n/getTranslations'
import { superCache } from '@/lib/superCache'
import {
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from './auth'
import { ChangeUsernameFormClient } from './ChangeUsernameFormClient'
import { getMyUser, getMyUserIdOrThrow } from './getMyUser'

export const ChangeUsernameForm = async ({
  redirectUrl,
}: {
  redirectUrl?: string
}) => {
  const user = await getMyUser()
  return (
    <>
      <ChangeUsernameFormClient
        action={async (data) => {
          'use server'
          return superAction(async () => {
            const userId = await getMyUserIdOrThrow()
            await auth.api.updateUser({
              body: {
                name: data.username,
              },
              headers: await headers(),
            })

            superCache.user({ id: userId }).update()

            const t = await getTranslations()
            const description = redirectUrl
              ? t.standardWords.redirecting
              : undefined

            streamToast({
              title: t.userManagement.userNameChanged,
              description,
            })

            redirect(redirectUrl || '/')
          })
        }}
        username={user?.name ?? undefined}
      />
    </>
  )
}

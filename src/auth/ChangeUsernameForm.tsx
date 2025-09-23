import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { getTranslations } from '@/i18n/getTranslations'
import { superCache } from '@/lib/superCache'
import {
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
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
            await db
              .update(schema.users)
              .set({
                name: data.username,
              })
              .where(eq(schema.users.id, userId))

            superCache.user({ id: userId }).revalidate()

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

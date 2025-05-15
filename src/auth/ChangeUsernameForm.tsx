import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { superAction } from '@/super-action/action/createSuperAction'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
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

            revalidatePath('/', 'layout')

            redirect(redirectUrl || '/')
          })
        }}
        username={user?.name ?? undefined}
        redirectUrl={redirectUrl}
      />
    </>
  )
}

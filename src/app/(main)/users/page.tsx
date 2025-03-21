import { notFoundIfNotAdmin, throwIfNotAdmin } from '@/auth/getIsAdmin'
import { getMyUserId } from '@/auth/getMyUser'
import { impersonate } from '@/auth/impersonate'
import { SimpleParamSelect } from '@/components/simple/SimpleParamSelect'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { db } from '@/db/db'
import { user as usersTable } from '@/db/schema-auth'
import {
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { streamRevalidatePath } from '@/super-action/action/streamRevalidatePath'
import { ActionButton } from '@/super-action/button/ActionButton'
import { ActionWrapper } from '@/super-action/button/ActionWrapper'
import { eq } from 'drizzle-orm'
import { Check } from 'lucide-react'
import { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { Fragment } from 'react'
import { CreateUserButton } from './CreateUserButton'

export const metadata: Metadata = {
  title: 'Users',
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: 'admins'
  }>
}) {
  const { filter } = await searchParams
  await notFoundIfNotAdmin({ allowDev: true })
  const myUserId = await getMyUserId()
  const users = await db.query.user.findMany({
    with: {
      accounts: true,
    },
    where: filter === 'admins' ? eq(usersTable.isAdmin, true) : undefined,
  })

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 items-center">
        <CardTitle className="flex-1">Users</CardTitle>
        <SimpleParamSelect
          paramKey="filter"
          component="tabs"
          options={[
            { value: null, label: 'All Users' },
            { value: 'admins', label: 'Admins' },
          ]}
        />
        <CreateUserButton />
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        {users.map((user) => {
          const isAdmin = !!user.isAdmin
          const tags: string[] = []
          if (user.accounts.some((a) => !!a.password)) tags.push('password')
          for (const account of user.accounts) {
            tags.push(account.providerId)
          }
          return (
            <Fragment key={user.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{user.name ?? user.email}</CardTitle>
                  <CardDescription>{user.id}</CardDescription>
                  {tags.length && (
                    <div className="flex flex-row gap-2">
                      {tags.map((tag) => (
                        <Fragment key={tag}>
                          <div className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs">
                            {tag}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div>
                    <div>{user.email}</div>
                    <div className="text-muted-foreground">
                      {user.emailVerified ? <>Verified</> : <>Not verified</>}
                    </div>
                  </div>
                  <label className="">
                    <div className="flex-1">Admin</div>
                    <ActionWrapper
                      askForConfirmation
                      action={async () => {
                        'use server'
                        return superAction(async () => {
                          await db
                            .update(usersTable)
                            .set({ isAdmin: !isAdmin })
                            .where(eq(usersTable.id, user.id))
                          streamToast({
                            title: isAdmin ? 'Removed admin' : 'Made admin',
                            description: `User ${user.email} is now ${
                              isAdmin ? 'not' : ''
                            } an admin`,
                          })
                          revalidatePath('/users')
                        })
                      }}
                      command={{
                        label: `${isAdmin ? 'Remove' : 'Make'} admin: ${
                          user.email
                        }`,
                      }}
                    >
                      <Switch checked={isAdmin} />
                    </ActionWrapper>
                  </label>
                  <div className="flex flex-row gap-2 items-center justify-end">
                    <ActionButton
                      size="sm"
                      variant={'outline'}
                      askForConfirmation={{
                        title: 'Really delete?',
                        content: `This will delete the user ${user.email}`,
                        confirm: 'Delete user',
                        cancel: 'Cancel',
                      }}
                      action={async () => {
                        'use server'
                        return superAction(async () => {
                          await throwIfNotAdmin({ allowDev: true })
                          await db
                            .delete(usersTable)
                            .where(eq(usersTable.id, user.id))
                            .execute()
                          streamToast({
                            title: 'User deleted',
                            description: `Bye ${user.email} 👋`,
                          })
                          revalidatePath('/users')
                        })
                      }}
                      command={{
                        label: `Delete user: ${user.email}`,
                      }}
                    >
                      Delete
                    </ActionButton>
                    <ActionButton
                      size="sm"
                      variant={'outline'}
                      disabled={myUserId === user.id}
                      icon={myUserId === user.id ? <Check /> : undefined}
                      action={async () => {
                        'use server'
                        return superAction(async () => {
                          await throwIfNotAdmin({ allowDev: true })
                          await impersonate({ userId: user.id })
                          streamRevalidatePath('/', 'layout') // force refresh
                        })
                      }}
                    >
                      Login as
                    </ActionButton>
                  </div>
                </CardContent>
              </Card>
            </Fragment>
          )
        })}
      </div>
    </>
  )
}

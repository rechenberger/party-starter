import { notFoundIfNotAdmin, throwIfNotAdmin } from '@/auth/getIsAdmin'
import { getMyUserId } from '@/auth/getMyUser'
import { impersonate } from '@/auth/impersonate'
import { TopHeader } from '@/components/TopHeader'
import { DateFnsFormat } from '@/components/date-fns-client/DateFnsFormat'
import { SimpleParamSelect } from '@/components/simple/SimpleParamSelect'
import { SimpleUserAvatar } from '@/components/simple/SimpleUserAvatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { db } from '@/db/db'
import { users as usersTable } from '@/db/schema-auth'
import { getTranslations } from '@/i18n/getTranslations'
import { superCache } from '@/lib/superCache'
import { cn } from '@/lib/utils'
import {
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { streamRevalidatePath } from '@/super-action/action/streamRevalidatePath'
import { ActionButton } from '@/super-action/button/ActionButton'
import { ActionWrapper } from '@/super-action/button/ActionWrapper'
import { asc, eq } from 'drizzle-orm'
import { Check } from 'lucide-react'
import { Metadata } from 'next'
import { Fragment } from 'react'
import { CreateUserButton } from './CreateUserButton'

export const metadata: Metadata = {
  title: 'Users',
}

const getUsers = async ({ filter }: { filter?: 'admins' }) => {
  'use cache'
  superCache.users().tag()
  const users = await db.query.users.findMany({
    with: {
      accounts: true,
    },
    where: filter === 'admins' ? eq(usersTable.isAdmin, true) : undefined,
    orderBy: [asc(usersTable.createdAt)],
  })

  return users
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
  const users = await getUsers({ filter })
  const t = await getTranslations()
  return (
    <>
      <TopHeader>
        <div className="flex w-full flex-row justify-between gap-2 items-center">
          <CardTitle className="flex-1">{t.users.title}</CardTitle>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <SimpleParamSelect
              paramKey="filter"
              component="tabs"
              options={[
                { value: null, label: t.users.allUsers },
                { value: 'admins', label: t.users.admins },
              ]}
            />
          </div>
          <CreateUserButton />
        </div>
      </TopHeader>

      <div className="grid lg:grid-cols-3 gap-4">
        {users.map((user) => {
          const isAdmin = !!user.isAdmin
          const tags: string[] = []
          if (user.passwordHash) tags.push('password')
          for (const account of user.accounts) {
            tags.push(account.provider)
          }
          const isCurrentUser = myUserId === user.id
          return (
            <Fragment key={user.id}>
              <Card className={cn(isCurrentUser && 'border-primary')}>
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center">
                    <SimpleUserAvatar user={user} />
                    <div className="flex flex-col">
                      <div className="font-medium">{user.name}</div>
                      <div
                        className={cn(
                          !!user.name
                            ? 'text-muted-foreground text-xs'
                            : 'font-medium',
                        )}
                      >
                        {user.email}
                      </div>
                    </div>
                  </CardTitle>
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
                      {user.emailVerified ? (
                        <>
                          {t.users.emailVerified}{' '}
                          <DateFnsFormat
                            date={user.emailVerified}
                            format="Ppp"
                          />
                        </>
                      ) : (
                        <>{t.users.emailNotVerified}</>
                      )}
                    </div>
                  </div>
                  <label className="">
                    <div className="flex-1">{t.users.admin}</div>
                    <ActionWrapper
                      askForConfirmation={{
                        title: isAdmin
                          ? t.users.removeAdmin(user.name ?? user.email)
                          : t.users.makeAdmin(user.name ?? user.email),
                      }}
                      action={async () => {
                        'use server'
                        return superAction(async () => {
                          const t = await getTranslations()
                          await db
                            .update(usersTable)
                            .set({ isAdmin: !isAdmin })
                            .where(eq(usersTable.id, user.id))

                          superCache.user({ id: user.id }).revalidate()

                          streamToast({
                            title: isAdmin
                              ? t.users.removedAdmin
                              : t.users.madeAdmin,
                            description: isAdmin
                              ? t.users.removeAdminDescription(user.email)
                              : t.users.makeAdminDescription(user.email),
                          })
                        })
                      }}
                      command={{
                        label: `${isAdmin ? t.users.removeAdmin : t.users.makeAdmin}: ${
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
                        title: t.userManagement.deleteUser.confirmation.title,
                        content:
                          t.userManagement.deleteUser.confirmation.content(
                            user.name ?? user.email,
                          ),
                        confirm:
                          t.userManagement.deleteUser.confirmation.confirm,
                      }}
                      action={async () => {
                        'use server'
                        return superAction(async () => {
                          const t = await getTranslations()
                          await throwIfNotAdmin({ allowDev: true })
                          await db
                            .delete(usersTable)
                            .where(eq(usersTable.id, user.id))
                            .execute()

                          superCache.all().revalidate()

                          streamToast({
                            title: t.userManagement.deleteUser.success(
                              user.name ?? user.email,
                            ),
                            description: `Bye ${user.email} 👋`,
                          })
                        })
                      }}
                      command={{
                        label: t.userManagement.deleteUser.title(
                          user.name ?? user.email,
                        ),
                      }}
                    >
                      {t.userManagement.deleteUser.delete}
                    </ActionButton>
                    <ActionButton
                      size="sm"
                      variant={'outline'}
                      disabled={isCurrentUser}
                      icon={isCurrentUser ? <Check /> : undefined}
                      action={async () => {
                        'use server'
                        return superAction(async () => {
                          await throwIfNotAdmin({ allowDev: true })
                          await impersonate({ userId: user.id })
                          streamRevalidatePath('/', 'layout') // force refresh
                        })
                      }}
                    >
                      {isCurrentUser
                        ? t.userManagement.currentUser
                        : t.userManagement.loginAs}
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

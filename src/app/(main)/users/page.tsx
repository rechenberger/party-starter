import { notFoundIfNotAdmin, throwIfNotAdmin } from '@/auth/getIsAdmin'
import { getMyUserId } from '@/auth/getMyUser'
import { TopHeader } from '@/components/TopHeader'
import { UserAvatar } from '@/components/UserAvatar'
import { DateFnsFormat } from '@/components/date-fns-client/DateFnsFormat'
import { SimpleParamSelect } from '@/components/simple/SimpleParamSelect'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { db } from '@/db/db'
import { users as usersTable } from '@/db/schema-auth'
import { getTranslations } from '@/i18n/getTranslations'
import { superCache } from '@/lib/superCache'
import { cn } from '@/lib/utils'
import {
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { and, asc, count, eq, ilike, or } from 'drizzle-orm'
import { Trash2 } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { AdminToggleSwitch } from './AdminToggleSwitch'
import { CreateUserButton } from './CreateUserButton'
import { ImpersonateButton } from './ImpersonateButton'

const USERS_PAGE_SIZE = 8

export const generateMetadata = async () => {
  const t = await getTranslations()
  return {
    title: t.users.title,
  } satisfies Metadata
}

const getPaginationItems = ({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1) as Array<
      number | 'ellipsis'
    >
  }

  const pages: Array<number | 'ellipsis'> = [1]
  const startPage = Math.max(2, currentPage - 1)
  const endPage = Math.min(totalPages - 1, currentPage + 1)

  if (startPage > 2) pages.push('ellipsis')
  for (let page = startPage; page <= endPage; page += 1) pages.push(page)
  if (endPage < totalPages - 1) pages.push('ellipsis')
  pages.push(totalPages)

  return pages
}

const getUsersHref = ({
  filter,
  query,
  page,
}: {
  filter?: 'admins'
  query?: string
  page?: number
}) => {
  const searchParams = new URLSearchParams()
  if (filter) searchParams.set('filter', filter)
  if (query) searchParams.set('q', query)
  if (page && page > 1) searchParams.set('page', page.toString())

  const queryString = searchParams.toString()
  return queryString.length > 0 ? `/users?${queryString}` : '/users'
}

const getUsers = async ({
  filter,
  query,
  page,
}: {
  filter?: 'admins'
  query?: string
  page: number
}) => {
  'use cache'
  superCache.users().tag()

  const whereClause = and(
    filter === 'admins' ? eq(usersTable.isAdmin, true) : undefined,
    query
      ? or(
          ilike(usersTable.name, `%${query}%`),
          ilike(usersTable.email, `%${query}%`),
          ilike(usersTable.id, `%${query}%`),
        )
      : undefined,
  )

  const [countResult] = await db
    .select({ count: count() })
    .from(usersTable)
    .where(whereClause)

  const totalUsers = countResult?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalUsers / USERS_PAGE_SIZE))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const offset = (currentPage - 1) * USERS_PAGE_SIZE

  const users = await db.query.users.findMany({
    with: {
      accounts: true,
    },
    where: whereClause,
    orderBy: [asc(usersTable.createdAt)],
    limit: USERS_PAGE_SIZE,
    offset,
  })

  return { users, totalUsers, totalPages, currentPage }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: 'admins'
    q?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const filter = params.filter === 'admins' ? 'admins' : undefined
  const query = params.q?.trim() || undefined
  const pageRaw = params.page ? Number.parseInt(params.page, 10) : 1
  const requestedPage = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1

  await notFoundIfNotAdmin({ allowDev: true })

  const myUserId = await getMyUserId()
  const { users, totalUsers, totalPages, currentPage } = await getUsers({
    filter,
    query,
    page: requestedPage,
  })
  const t = await getTranslations()

  const paginationItems = getPaginationItems({ currentPage, totalPages })
  const firstUserIndex =
    totalUsers === 0 ? 0 : (currentPage - 1) * USERS_PAGE_SIZE + 1
  const lastUserIndex = Math.min(currentPage * USERS_PAGE_SIZE, totalUsers)

  return (
    <>
      <TopHeader>
        <div className="flex w-full gap-2 items-center">
          <CardTitle className="mr-auto">{t.users.title}</CardTitle>
          <CreateUserButton />
        </div>
      </TopHeader>

      <Card>
        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-wrap gap-2 items-center">
            <SimpleParamSelect
              paramKey="filter"
              component="tabs"
              options={[
                { value: null, label: t.users.allUsers },
                { value: 'admins', label: t.users.admins },
              ]}
            />
            <form
              action="/users"
              method="GET"
              className="flex flex-1 flex-wrap gap-2 items-center"
            >
              {!!filter && <input type="hidden" name="filter" value={filter} />}
              <label htmlFor="users-search" className="sr-only">
                {t.users.search}
              </label>
              <Input
                id="users-search"
                name="q"
                type="search"
                data-testid="users-search-input"
                defaultValue={query}
                placeholder={t.users.searchPlaceholder}
                className="flex-1 min-w-[180px]"
              />
              <Button type="submit" size="sm" data-testid="users-search-submit">
                {t.users.search}
              </Button>
              {!!query && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    data-testid="users-search-clear"
                    href={getUsersHref({ filter })}
                  >
                    {t.users.clearSearch}
                  </Link>
                </Button>
              )}
            </form>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.users.table.user}</TableHead>
                <TableHead>{t.users.table.signInMethods}</TableHead>
                <TableHead>{t.users.table.verified}</TableHead>
                <TableHead>{t.users.table.admin}</TableHead>
                <TableHead className="text-right">
                  {t.users.table.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    {t.users.table.noUsersFound}
                  </TableCell>
                </TableRow>
              )}

              {users.map((user) => {
                const isAdmin = !!user.isAdmin
                const tags: string[] = []
                if (user.passwordHash) tags.push('password')
                for (const account of user.accounts) {
                  tags.push(account.provider)
                }
                const isCurrentUser = myUserId === user.id
                const deleteUserLabel = t.userManagement.deleteUser.title(
                  user.name ?? user.email,
                )

                return (
                  <TableRow
                    key={user.id}
                    data-testid={`user-row-${user.id}`}
                    className={cn(isCurrentUser && 'bg-primary/5')}
                  >
                    <TableCell className="min-w-[280px] whitespace-normal">
                      <div className="flex items-center gap-2">
                        <UserAvatar user={user} />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {user.name ?? user.email}
                            </span>
                            {isCurrentUser && (
                              <Badge variant="secondary">
                                {t.standardWords.you}
                              </Badge>
                            )}
                          </div>
                          <span
                            className={cn(
                              !!user.name
                                ? 'text-muted-foreground text-xs'
                                : 'font-medium',
                            )}
                          >
                            {user.email}
                          </span>
                          <span className="text-muted-foreground text-[11px] font-mono">
                            {user.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[260px] whitespace-normal">
                      {tags.length > 0 ? (
                        <div className="flex flex-col items-start gap-1">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {t.users.table.noSignInMethods}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-muted-foreground text-sm">
                        {user.emailVerified ? (
                          <div className="flex flex-col gap-0.5">
                            <span>{t.users.emailVerified}</span>
                            <DateFnsFormat
                              date={user.emailVerified}
                              format="Ppp"
                            />
                          </div>
                        ) : (
                          <>{t.users.emailNotVerified}</>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <AdminToggleSwitch
                          userId={user.id}
                          userEmail={user.email}
                          userDisplay={user.name ?? user.email}
                          isAdmin={isAdmin}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2 min-w-[88px]">
                        <ActionButton
                          data-testid={`user-delete-${user.id}`}
                          size="icon-sm"
                          variant="outline"
                          title={deleteUserLabel}
                          aria-label={deleteUserLabel}
                          askForConfirmation={{
                            title:
                              t.userManagement.deleteUser.confirmation.title,
                            content:
                              t.userManagement.deleteUser.confirmation.content(
                                user.name ?? user.email,
                              ),
                            confirm:
                              t.userManagement.deleteUser.confirmation.confirm,
                          }}
                          icon={<Trash2 />}
                          action={async () => {
                            'use server'
                            return superAction(async () => {
                              const t = await getTranslations()
                              await throwIfNotAdmin({ allowDev: true })
                              await db
                                .delete(usersTable)
                                .where(eq(usersTable.id, user.id))
                                .execute()

                              superCache.all().update()

                              streamToast({
                                title: t.userManagement.deleteUser.success(
                                  user.name ?? user.email,
                                ),
                                description: `Bye ${user.email} 👋`,
                              })
                            })
                          }}
                          command={{
                            label: deleteUserLabel,
                          }}
                        >
                          <span className="sr-only">
                            {t.userManagement.deleteUser.delete}
                          </span>
                        </ActionButton>
                        <ImpersonateButton userId={user.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              {totalUsers === 0
                ? t.users.table.noUsersFound
                : t.users.pagination.summary(
                    firstUserIndex,
                    lastUserIndex,
                    totalUsers,
                  )}
            </p>
            {totalPages > 1 && (
              <Pagination
                className="md:justify-end"
                data-testid="users-pagination"
              >
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={
                        currentPage > 1
                          ? getUsersHref({
                              filter,
                              query,
                              page: currentPage - 1,
                            })
                          : undefined
                      }
                      className={cn(
                        currentPage <= 1 && 'pointer-events-none opacity-50',
                      )}
                    />
                  </PaginationItem>
                  {paginationItems.map((item, index) => (
                    <PaginationItem key={`${item}-${index}`}>
                      {item === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href={getUsersHref({ filter, query, page: item })}
                          isActive={item === currentPage}
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href={
                        currentPage < totalPages
                          ? getUsersHref({
                              filter,
                              query,
                              page: currentPage + 1,
                            })
                          : undefined
                      }
                      className={cn(
                        currentPage >= totalPages &&
                          'pointer-events-none opacity-50',
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

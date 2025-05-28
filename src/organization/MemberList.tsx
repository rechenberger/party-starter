'use client'

import { DateFnsFormat } from '@/components/date-fns-client/DateFnsFormat'
import { SimpleUserAvatar } from '@/components/simple/SimpleUserAvatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Organization, OrganizationMembership, User } from '@/db/schema-zod'
import { useSuperAction } from '@/super-action/action/useSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { LogOut, Search, Trash2, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'
import {
  OrganizationRole,
  getOrganizationRole,
  organizationRoleDefinitions,
} from './organizationRoles'

import {
  changeRoleAction,
  kickUserAction,
} from '@/app/org/[orgSlug]/settings/members/actions'
import { DateFnsFormatDistanceToNow } from '@/components/date-fns-client/DateFnsFormatDistanceToNow'
import { useTranslations } from '@/i18n/useTranslations'
type MembershipWithUser = Pick<
  OrganizationMembership,
  'userId' | 'role' | 'createdAt'
> & {
  user: Pick<User, 'name' | 'email' | 'image'>
}

export const MemberList = ({
  org,
  isAdmin,
}: {
  org: Organization & {
    memberships: MembershipWithUser[]
  }
  isAdmin: boolean
}) => {
  const { data: session } = useSession()
  const myUserId = session?.user?.id
  console.log({ myUserId })

  const { trigger, isLoading: isChangeRoleLoading } = useSuperAction({
    action: changeRoleAction,
    catchToast: true,
  })

  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredMemberships = useMemo(() => {
    if (!searchQuery.trim()) {
      return org.memberships
    }

    const filtered = org.memberships.filter((membership) => {
      const userName = membership.user.name?.toLowerCase() || ''
      const userEmail = membership.user.email?.toLowerCase() || ''
      const query = searchQuery.toLowerCase()

      return userName.includes(query) || userEmail.includes(query)
    })

    return filtered
  }, [org, searchQuery])

  const t = useTranslations()

  return (
    <>
      <div className="space-y-8">
        <Card key={org.id} className="w-full">
          <CardHeader>
            <div className="flex items-center">
              <div className="flex flex-col gap-2">
                <CardTitle>{org.name}</CardTitle>
                <CardDescription>
                  {t.standardWords.created}{' '}
                  <DateFnsFormat date={org.createdAt} format="PPP" />
                </CardDescription>
              </div>
              <div className="flex-1"></div>
              <Badge variant="outline" className="text-xs">
                {filteredMemberships.length}{' '}
                {filteredMemberships.length === 1
                  ? t.org.members.member
                  : t.org.members.members}
              </Badge>
            </div>

            {/* Search input */}
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.org.members.searchPlaceholder}
                className="px-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.org.members.member}</TableHead>
                  <TableHead>{t.org.members.joined}</TableHead>
                  <TableHead>{t.org.members.role}</TableHead>
                  <TableHead className="text-right">
                    {t.org.members.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMemberships.map((membership) => {
                  const isMyMember = membership.userId === myUserId
                  return (
                    <TableRow key={membership.userId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <SimpleUserAvatar user={membership.user} />
                          <div>
                            <p className="font-medium">
                              {membership.user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {membership.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <DateFnsFormatDistanceToNow
                          date={membership.createdAt}
                          options={{
                            addSuffix: true,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {isAdmin && (
                          <Select
                            defaultValue={membership.role}
                            onValueChange={(value: OrganizationRole) =>
                              trigger({
                                userId: membership.userId,
                                role: value,
                                orgSlug: org.slug,
                              })
                            }
                            disabled={isChangeRoleLoading}
                            value={membership.role}
                          >
                            <SelectTrigger className="w-[110px]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {organizationRoleDefinitions.map((role) => (
                                <SelectItem key={role.name} value={role.name}>
                                  {t.roles[role.i18nKey]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {!isAdmin && (
                          <Badge variant="outline" className="text-xs">
                            {
                              t.roles[
                                getOrganizationRole(membership.role).i18nKey
                              ]
                            }
                          </Badge>
                        )}
                      </TableCell>
                      {(isAdmin || isMyMember) && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <ActionButton
                              variant="ghost"
                              size="icon"
                              // disabled={isDeleting}
                              catchToast
                              hideIcon
                              askForConfirmation={{
                                title: isMyMember
                                  ? t.org.leave.confirmation.title
                                  : t.org.kick.confirmation.title,
                                content: isMyMember
                                  ? t.org.leave.confirmation.content
                                  : t.org.kick.confirmation.content(
                                      membership.user.name ??
                                        membership.user.email,
                                    ),
                              }}
                              action={async () =>
                                kickUserAction({
                                  userId: membership.userId,
                                  orgSlug: org.slug,
                                })
                              }
                              title={
                                isMyMember
                                  ? t.org.leave.confirmation.title
                                  : t.org.kick.confirmation.title
                              }
                            >
                              {isMyMember ? (
                                <LogOut className="h-4 w-4 text-destructive" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-destructive" />
                              )}
                              <span className="sr-only">
                                {isMyMember
                                  ? t.org.leave.confirmation.title
                                  : t.org.kick.confirmation.title}
                              </span>
                            </ActionButton>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

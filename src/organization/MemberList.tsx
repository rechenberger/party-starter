'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { schema } from '@/db/schema-export'
import { Organization, OrganizationMembership, User } from '@/db/schema-zod'
import { SuperActionWithInput } from '@/super-action/action/createSuperAction'
import { useSuperAction } from '@/super-action/action/useSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { capitalCase } from 'change-case'
import { formatDistanceToNow } from 'date-fns'
import { LogOut, Search, Trash2, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'

type MembershipWithUser = Pick<
  OrganizationMembership,
  'userId' | 'role' | 'createdAt'
> & {
  user: Pick<User, 'name' | 'email' | 'image'>
}

export const MemberList = ({
  organization,
  changeRoleAction,
  kickUserAction,
  isAdmin,
}: {
  organization: Organization & {
    memberships: MembershipWithUser[]
  }
  changeRoleAction: SuperActionWithInput<{
    userId: string
    role: schema.OrganizationRole
  }>
  kickUserAction: SuperActionWithInput<{
    userId: string
  }>
  isAdmin: boolean
}) => {
  const { data: session } = useSession()
  const myUserId = session?.user?.id

  const { trigger, isLoading: isChangeRoleLoading } = useSuperAction({
    action: changeRoleAction,
    catchToast: true,
  })

  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter memberships based on search query
  const filteredMemberships = useMemo(() => {
    if (!searchQuery.trim()) {
      return organization.memberships
    }

    const filtered = organization.memberships.filter((membership) => {
      const userName = membership.user.name?.toLowerCase() || ''
      const userEmail = membership.user.email?.toLowerCase() || ''
      const query = searchQuery.toLowerCase()

      return userName.includes(query) || userEmail.includes(query)
    })

    return filtered
  }, [organization, searchQuery])

  return (
    <>
      <div className="space-y-8">
        <Card key={organization.id} className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{organization.name}</CardTitle>
                <CardDescription>
                  Created{' '}
                  {formatDistanceToNow(new Date(organization.createdAt), {
                    addSuffix: true,
                  })}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {filteredMemberships.length}{' '}
                {filteredMemberships.length === 1 ? 'member' : 'members'}
              </Badge>
            </div>

            {/* Search input */}
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search members by name or email..."
                className="pl-8"
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
                  <TableHead>Member</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMemberships.map((membership) => (
                  <TableRow key={membership.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={membership.user.image || ''}
                            alt={membership.user.name || 'Member'}
                          />
                          <AvatarFallback>
                            {membership.user.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{membership.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {membership.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(membership.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      {isAdmin && (
                        <Select
                          defaultValue={membership.role}
                          onValueChange={(value: 'admin' | 'member') =>
                            trigger({
                              userId: membership.userId,
                              role: value as schema.OrganizationRole,
                            })
                          }
                          disabled={isChangeRoleLoading}
                          value={membership.role}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {!isAdmin && (
                        <Badge variant="outline" className="text-xs">
                          {capitalCase(membership.role)}
                        </Badge>
                      )}
                    </TableCell>
                    {(isAdmin || membership.userId === myUserId) && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <ActionButton
                            variant="ghost"
                            size="icon"
                            // disabled={isDeleting}
                            catchToast
                            hideIcon
                            askForConfirmation
                            action={async () =>
                              kickUserAction({
                                userId: membership.userId,
                              })
                            }
                            title="Kick user"
                          >
                            {membership.userId === myUserId ? (
                              <LogOut className="h-4 w-4 text-destructive" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            )}
                            <span className="sr-only">Kick user</span>
                          </ActionButton>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

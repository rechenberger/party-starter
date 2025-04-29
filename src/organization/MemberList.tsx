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
import { SuperActionPromise } from '@/super-action/action/createSuperAction'
import { useSuperAction } from '@/super-action/action/useSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { formatDistanceToNow } from 'date-fns'
import { LogOut, Search, Trash2, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

type User = {
  id: string
  email: string
  emailVerified: Date | null
  name: string | null
  image: string | null
}

type Membership = {
  createdAt: Date
  role: 'admin' | 'member'
  userId: string
  user: User
}

type Organization = {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  slug: string
  memberships: Membership[]
}

export const MemberList = ({
  organization,
  changeRoleAction,
  kickUserAction,
  isAdmin,
}: {
  organization: Organization
  changeRoleAction: (data: {
    userId: string
    role: schema.OrganizationRole
  }) => SuperActionPromise<
    void,
    { userId: string; role: schema.OrganizationRole }
  >
  kickUserAction: (data: {
    userId: string
  }) => SuperActionPromise<void, { userId: string }>
  isAdmin: boolean
}) => {
  const { data: session } = useSession()
  const myUserId = session?.user?.id

  const { trigger, isLoading } = useSuperAction({
    action: changeRoleAction,
  })
  const { trigger: triggerKickUser, isLoading: isKickUserLoading } =
    useSuperAction({
      action: kickUserAction,
    })

  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('')
  // State for filtered memberships
  const [filteredMemberships, setFilteredMemberships] = useState<Membership[]>(
    organization.memberships,
  )

  // Handle search input change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
  }

  // Filter memberships based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMemberships(organization.memberships)
      return
    }

    const filtered = organization.memberships.filter((membership) => {
      const userName = membership.user.name?.toLowerCase() || ''
      const userEmail = membership.user.email?.toLowerCase() || ''
      const query = searchQuery.toLowerCase()

      return userName.includes(query) || userEmail.includes(query)
    })

    setFilteredMemberships(filtered)
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
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
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
                          {membership.role}
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
                              triggerKickUser({
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

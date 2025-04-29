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
import { Trash2 } from 'lucide-react'

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
  organizations,
  changeRoleAction,
  kickUserAction,
}: {
  organizations: Organization[]
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
}) => {
  const { trigger, isLoading } = useSuperAction({
    action: changeRoleAction,
  })
  const { trigger: triggerKickUser, isLoading: isKickUserLoading } =
    useSuperAction({
      action: kickUserAction,
    })

  return (
    <>
      <div className="space-y-8">
        {organizations.map((organization) => (
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
                  {organization.memberships.length}{' '}
                  {organization.memberships.length === 1 ? 'member' : 'members'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organization.memberships.map((membership) => (
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
                        {formatDistanceToNow(new Date(membership.createdAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <ActionButton
                          askForConfirmation
                          catchToast
                          hideIcon
                          action={async () =>
                            triggerKickUser({
                              userId: membership.userId,
                            })
                          }
                          variant="destructive"
                        >
                          <Trash2 /> Kick
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

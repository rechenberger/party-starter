import { CopyToClipboardButton } from '@/components/CopyToClipboardButton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { cn } from '@/lib/utils'
import {
  streamDialog,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import {
  addDays,
  addMonths,
  addYears,
  format,
  formatDistanceToNow,
  isPast,
} from 'date-fns'
import { eq } from 'drizzle-orm'
import { PlusCircle, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { CreateInviteCodeFormClient } from './CreateInviteCodeFormClient'
import { getMyMembershipOrThrow } from './getMyMembership'

type InvitationCode = {
  id: string
  role: 'admin' | 'member'
  expiresAt: Date | null
  maxUses: number | null
  currentUses: number | null
  createdAt: Date
  createdBy: {
    name: string | null
    image: string | null
    email: string
  } | null
}

export const InvitationCodesList = async ({
  organization,
}: {
  organization: {
    inviteCodes: InvitationCode[]
    id: string
    slug: string
  }
}) => {
  const myMembership = await getMyMembershipOrThrow({
    allowedRoles: ['admin'],
  })

  const {
    inviteCodes,
    id: organizationId,
    slug: organizationSlug,
  } = organization

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invitation Codes</CardTitle>
          <ActionButton
            size="sm"
            action={async () => {
              'use server'
              return superAction(async () => {
                return streamDialog({
                  title: 'Create Invitation Code',
                  content: (
                    <CreateInviteCodeFormClient
                      action={async (data) => {
                        'use server'
                        return superAction(async () => {
                          let expiresAtResolved: Date | null = null
                          switch (data.expiresAt) {
                            case 'never':
                              expiresAtResolved = null
                              break
                            case '1d':
                              expiresAtResolved = addDays(new Date(), 1)
                              break
                            case '1w':
                              expiresAtResolved = addDays(new Date(), 7)
                              break
                            case '1m':
                              expiresAtResolved = addMonths(new Date(), 1)
                              break
                            case '1y':
                              expiresAtResolved = addYears(new Date(), 1)
                              break
                            default:
                              throw new Error('Invalid expires at')
                          }
                          await db.insert(schema.inviteCodes).values({
                            organizationId: organizationId,
                            role: data.role,
                            expiresAt: expiresAtResolved,
                            maxUses: data.maxUses,
                            createdById: myMembership.userId,
                          })

                          revalidatePath(
                            `/org/${organizationId}/settings/members`,
                          )
                          streamDialog(null)
                        })
                      }}
                    />
                  ),
                })
              })
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Invitation Code
          </ActionButton>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Uses left</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inviteCodes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No invitation codes found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                inviteCodes.map((code) => {
                  const isExpired =
                    (code.expiresAt && isPast(code.expiresAt)) ||
                    (code.maxUses && code.currentUses === code.maxUses)
                  return (
                    <TableRow key={code.id}>
                      <TableCell
                        className={cn('font-mono', isExpired && 'line-through')}
                      >
                        {code.id}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            code.role === 'admin' ? 'default' : 'secondary'
                          }
                        >
                          {code.role}
                        </Badge>
                      </TableCell>
                      <TableCell
                        title={
                          code.expiresAt
                            ? format(code.expiresAt, 'MMM d, yyyy HH:mm')
                            : 'Never'
                        }
                      >
                        {code.expiresAt ? (
                          formatDistanceToNow(new Date(code.expiresAt), {
                            addSuffix: true,
                          })
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex text-xs">
                            {code.maxUses ? (
                              <span>
                                {code.maxUses - (code.currentUses ?? 0)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">∞</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {code.createdBy && (
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={code.createdBy?.image || ''}
                                alt={code.createdBy?.name || 'Member'}
                              />
                              <AvatarFallback>
                                {code.createdBy?.name
                                  ?.split(' ')
                                  .map((n) => n[0])
                                  .join('') || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {code.createdBy?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {code.createdBy?.email}
                              </p>
                            </div>
                          </div>
                        )}
                        {code.createdBy === null && (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <CopyToClipboardButton
                            text={`${process.env.BASE_URL}/join/${organizationSlug}/${code.id}`}
                          />
                          <ActionButton
                            variant="ghost"
                            size="icon"
                            // disabled={isDeleting}
                            catchToast
                            hideIcon
                            askForConfirmation
                            action={async () => {
                              'use server'
                              return superAction(async () => {
                                await db
                                  .update(schema.inviteCodes)
                                  .set({
                                    deletedAt: new Date(),
                                  })
                                  .where(eq(schema.inviteCodes.id, code.id))
                                revalidatePath(
                                  `/org/${organizationSlug}/settings/members`,
                                )
                              })
                            }}
                            title="Delete code"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete code</span>
                          </ActionButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

import { getMyUserOrThrow } from '@/auth/getMyUser'
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
import { InviteCode, User } from '@/db/schema-zod'
import { BASE_URL } from '@/lib/config'
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
import { Mail, PlusCircle, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { CreateInviteCodeEmailFormClient } from './CreateInviteCodeEmailFormClient'
import { CreateInviteCodeFormClient } from './CreateInviteCodeFormClient'
import { getMyMembershipOrThrow } from './getMyMembership'
import { getOrganizationRole, OrganizationRole } from './organizationRoles'
import { sendOrgInviteMail } from './sendOrgInviteMail'

const allowedRoles: OrganizationRole[] = ['admin']

export const InvitationCodesList = async ({
  organization,
}: {
  organization: {
    inviteCodes: (InviteCode & {
      createdBy: Pick<User, 'name' | 'email' | 'image'> | null
    })[]
    id: string
    slug: string
    name: string
  }
}) => {
  await getMyMembershipOrThrow({
    allowedRoles,
  })

  const {
    inviteCodes,
    id: organizationId,
    slug: organizationSlug,
    name: organizationName,
  } = organization

  const validInviteCodes = inviteCodes.filter((code) => {
    if (code.expiresAt && isPast(code.expiresAt)) {
      return false
    }
    if (
      !!code.usesMax &&
      !!code.usesCurrent &&
      code.usesCurrent >= code.usesMax
    ) {
      return false
    }
    return true
  })

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invitation Codes</CardTitle>
          <div className="flex gap-2">
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
                            const myMembership = await getMyMembershipOrThrow({
                              allowedRoles,
                            })
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
                              usesMax: data.usesMax,
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
            <ActionButton
              size="sm"
              action={async () => {
                'use server'
                return superAction(async () => {
                  return streamDialog({
                    title: 'Send Invitation Code',
                    content: (
                      <CreateInviteCodeEmailFormClient
                        action={async (data) => {
                          'use server'
                          return superAction(async () => {
                            const myMembership = await getMyMembershipOrThrow({
                              allowedRoles: ['admin'],
                            })
                            const newCode = await db
                              .insert(schema.inviteCodes)
                              .values({
                                organizationId: organizationId,
                                role: data.role,
                                expiresAt: addDays(new Date(), 1),
                                usesMax: 1,
                                createdById: myMembership.userId,
                              })
                              .returning({ id: schema.inviteCodes.id })

                            const code = newCode[0]

                            const me = await getMyUserOrThrow()

                            await sendOrgInviteMail({
                              receiverEmail: data.receiverEmail,
                              invitedByEmail: me.email,
                              invitedByUsername: me.name,
                              orgName: organizationName,
                              inviteLink: `${BASE_URL}/join/${organizationSlug}/${code.id}`,
                              role: data.role,
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
              <Mail className="mr-2 h-4 w-4" />
              Mail Invitation
            </ActionButton>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Uses left</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validInviteCodes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No invitation codes found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                validInviteCodes.map((code) => {
                  const isExpired =
                    (code.expiresAt && isPast(code.expiresAt)) ||
                    (code.usesMax && code.usesCurrent === code.usesMax)
                  return (
                    <TableRow key={code.id}>
                      <TableCell
                        className={cn('font-mono', isExpired && 'line-through')}
                      >
                        <CopyToClipboardButton
                          textToDisplay={code.id}
                          size="vanilla"
                          textToCopy={`${BASE_URL}/join/${organizationSlug}/${code.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            code.role === 'admin' ? 'default' : 'secondary'
                          }
                        >
                          {getOrganizationRole(code.role).label}
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
                            {code.usesMax ? (
                              <span>
                                {code.usesMax - (code.usesCurrent ?? 0)}
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

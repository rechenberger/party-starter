import { CopyToClipboardButton } from '@/components/CopyToClipboardButton'
import { SimpleUserAvatar } from '@/components/simple/SimpleUserAvatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import { getDateFnsLocale } from '@/i18n/getDateFnsLocale'
import { cn } from '@/lib/utils'
import {
  streamDialog,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { format, formatDistanceToNow } from 'date-fns'
import { eq } from 'drizzle-orm'
import { Info, PlusCircle, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import {
  getMyMembershipOrNotFound,
  getMyMembershipOrThrow,
} from '../getMyMembership'
import { OrganizationRole, getOrganizationRole } from '../organizationRoles'
import { CreateInviteCodeFormClient } from './CreateInviteCodeFormClient'
import { InvitationCodesListProps } from './InvitationCodesList'
import { getInviteCodeUrl } from './getInviteCodeUrl'
import { resolveExpiresAt } from './resolveExpiresAt'

const allowedRoles: OrganizationRole[] = ['admin']

export const NormalInviteCodesTable = async (
  props: InvitationCodesListProps,
) => {
  const { inviteCodes, id: orgId, slug: orgSlug } = props

  await getMyMembershipOrNotFound({
    allowedRoles,
  })
  const dateFnsLocale = await getDateFnsLocale()

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invitation Codes</CardTitle>
          <div className="flex gap-2">
            <ActionButton
              size="sm"
              icon={<PlusCircle className="mr-2 h-4 w-4" />}
              action={async () => {
                'use server'
                return superAction(async () => {
                  return streamDialog({
                    title: 'New Invitation Code',
                    description:
                      'Create and share the code with others to invite them to this organization.',
                    content: (
                      <CreateInviteCodeFormClient
                        organizationSlug={orgSlug}
                        action={async (data) => {
                          'use server'
                          return superAction(async () => {
                            const { membership } = await getMyMembershipOrThrow(
                              {
                                allowedRoles,
                                orgSlug,
                              },
                            )
                            const expiresAtResolved = resolveExpiresAt(
                              data.expiresAt,
                            )
                            const [code] = await db
                              .insert(schema.inviteCodes)
                              .values({
                                organizationId: orgId,
                                role: data.role,
                                expiresAt: expiresAtResolved,
                                usesMax: data.usesMax,
                                comment: data.comment,
                                createdById: membership.userId,
                                updatedById: membership.userId,
                              })
                              .returning({
                                id: schema.inviteCodes.id,
                              })

                            revalidatePath(`/org/${orgId}/settings/members`)
                            return {
                              id: code.id,
                            }
                          })
                        }}
                      />
                    ),
                  })
                })
              }}
            >
              Add Invitation Code
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
                <TableHead>Updated By</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inviteCodes.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-center py-6 text-muted-foreground"
                    colSpan={42} //just a high number to make sure the cell takes the full width
                  >
                    No invitation codes found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                inviteCodes.map((code) => {
                  return (
                    <TableRow key={code.id}>
                      <TableCell
                        className={cn(
                          'font-mono',
                          code.isExpired && 'line-through',
                        )}
                      >
                        <CopyToClipboardButton
                          textToDisplay={code.id}
                          size="vanilla"
                          textToCopy={getInviteCodeUrl({
                            organizationSlug: orgSlug,
                            code: code.id,
                          })}
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
                            ? format(code.expiresAt, 'MMM d, yyyy HH:mm', {
                                locale: dateFnsLocale,
                              })
                            : 'Never'
                        }
                      >
                        {code.expiresAt ? (
                          formatDistanceToNow(new Date(code.expiresAt), {
                            addSuffix: true,
                            locale: dateFnsLocale,
                          })
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex text-xs">
                            {code.usesMax !== null ? (
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
                        {code.updatedBy && (
                          <div className="flex items-center gap-3">
                            <SimpleUserAvatar user={code.updatedBy} />
                            <div>
                              <p className="font-medium">
                                {code.updatedBy.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {code.updatedBy.email}
                              </p>
                            </div>
                          </div>
                        )}
                        {code.updatedBy === null && (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {code.comment && code.comment.length > 20 ? (
                          <Popover>
                            <PopoverTrigger>
                              <div className="flex items-center gap-1">
                                <span className="">
                                  {code.comment.slice(0, 20)}...
                                </span>
                                <Info className="size-4 flex-shrink-0" />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent side="top" className="break-words">
                              {code.comment}
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span>{code.comment}</span>
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
                                const { membership } =
                                  await getMyMembershipOrThrow({
                                    allowedRoles,
                                    orgSlug,
                                  })

                                await db
                                  .update(schema.inviteCodes)
                                  .set({
                                    deletedAt: new Date(),
                                    updatedById: membership.userId,
                                  })
                                  .where(eq(schema.inviteCodes.id, code.id))
                                revalidatePath(
                                  `/org/${orgSlug}/settings/members`,
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

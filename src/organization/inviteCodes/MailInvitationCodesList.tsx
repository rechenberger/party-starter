import { getMyUserOrThrow } from '@/auth/getMyUser'
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
import { ORGS } from '@/lib/starter.config'
import { cn } from '@/lib/utils'
import {
  streamDialog,
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import { and, desc, eq } from 'drizzle-orm'
import { Mail, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { getMyMembershipOrThrow } from '../getMyMembership'
import { getOrganizationRole } from '../organizationRoles'
import { sendOrgInviteMail } from '../sendOrgInviteMail'
import { CreateInviteCodeEmailFormClient } from './CreateInviteCodeEmailFormClient'
import { getInviteCodeUrl } from './getInviteCodeUrl'
import { InvitationCodesListProps } from './InvitationCodesList'
import { resolveExpiresAt } from './resolveExpiresAt'

export const MailInvitationCodesList = async (
  props: InvitationCodesListProps,
) => {
  const {
    inviteCodes,
    id: organizationId,
    slug: organizationSlug,
    name: organizationName,
  } = props

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mail Invitations</CardTitle>
          <div className="flex gap-2">
            <ActionButton
              size="sm"
              icon={<Mail className="h-4 w-4" />}
              action={async () => {
                'use server'
                return superAction(async () => {
                  return streamDialog({
                    title: 'Send Invitation Mail',
                    content: (
                      <CreateInviteCodeEmailFormClient
                        action={async (data) => {
                          'use server'
                          return superAction(async () => {
                            const { membership: myMembership } =
                              await getMyMembershipOrThrow({
                                allowedRoles: ['admin'],
                              })
                            await Promise.all(
                              data.receiverEmail.map(async (mail) => {
                                const me = await getMyUserOrThrow()
                                const existingCode = await db
                                  .select()
                                  .from(schema.inviteCodes)
                                  .where(
                                    and(
                                      eq(schema.inviteCodes.sentToEmail, mail),
                                      eq(
                                        schema.inviteCodes.organizationId,
                                        organizationId,
                                      ),
                                    ),
                                  )
                                  .orderBy(desc(schema.inviteCodes.createdAt))
                                  .limit(1)
                                const newCode = await db
                                  .insert(schema.inviteCodes)
                                  .values({
                                    id: existingCode[0]?.id,
                                    organizationId: organizationId,
                                    role: data.role,
                                    expiresAt: resolveExpiresAt(
                                      ORGS.defaultExpirationEmailInvitation,
                                    ),
                                    usesMax: 1,
                                    createdById: myMembership.userId,
                                    sentToEmail: mail,
                                  })
                                  .onConflictDoUpdate({
                                    target: [schema.inviteCodes.id],
                                    set: {
                                      role: data.role,
                                      usesMax: 1,
                                      expiresAt: resolveExpiresAt(
                                        ORGS.defaultExpirationEmailInvitation,
                                      ),
                                      deletedAt: null,
                                      createdById: me.id,
                                    },
                                  })
                                  .returning({ id: schema.inviteCodes.id })

                                const code = newCode[0]

                                await sendOrgInviteMail({
                                  receiverEmail: mail,
                                  invitedByEmail: me.email,
                                  invitedByUsername: me.name,
                                  orgName: organizationName,
                                  inviteLink: getInviteCodeUrl({
                                    organizationSlug,
                                    code: code.id,
                                  }),
                                  role: data.role,
                                })
                              }),
                            )

                            revalidatePath(
                              `/org/${organizationId}/settings/members`,
                            )

                            streamToast({
                              title: `Invitation sent to ${data.receiverEmail.join(', ')}`,
                            })
                            streamDialog(null)
                          })
                        }}
                      />
                    ),
                  })
                })
              }}
            >
              Mail Invitation
            </ActionButton>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receiver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Invited At</TableHead>
                <TableHead>Invited By</TableHead>
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
                    No invitation codes sent yet.
                  </TableCell>
                </TableRow>
              ) : (
                inviteCodes.map((code) => {
                  const status =
                    (code.usesCurrent || 0) > 0
                      ? 'Accepted'
                      : code.expiresAt && isPast(code.expiresAt)
                        ? 'Expired'
                        : 'Pending'
                  return (
                    <TableRow key={code.id}>
                      <TableCell className={cn()}>{code.sentToEmail}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            status === 'Accepted'
                              ? 'default'
                              : status === 'Expired'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {status}
                        </Badge>
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
                          code.updatedAt
                            ? format(code.updatedAt, 'MMM d, yyyy HH:mm')
                            : 'Never'
                        }
                      >
                        {formatDistanceToNow(new Date(code.updatedAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        {code.createdBy && (
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={code.createdBy?.image || undefined}
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
                            askForConfirmation={{
                              title: 'Resend invitation',
                              content:
                                'Are you sure you want to resend the invitation?',
                            }}
                            action={async () => {
                              'use server'
                              return superAction(async () => {
                                await getMyMembershipOrThrow({
                                  allowedRoles: ['admin'],
                                })
                                if (!code.sentToEmail) {
                                  throw new Error('No email found')
                                }
                                await db
                                  .update(schema.inviteCodes)
                                  .set({
                                    expiresAt: resolveExpiresAt(
                                      ORGS.defaultExpirationEmailInvitation,
                                    ),
                                  })
                                  .where(eq(schema.inviteCodes.id, code.id))

                                const me = await getMyUserOrThrow()

                                await sendOrgInviteMail({
                                  receiverEmail: code.sentToEmail,
                                  invitedByEmail: me.email,
                                  invitedByUsername: me.name,
                                  orgName: organizationName,
                                  inviteLink: getInviteCodeUrl({
                                    organizationSlug,
                                    code: code.id,
                                  }),
                                  role: code.role,
                                })

                                streamToast({
                                  title: `Invitation sent to ${code.sentToEmail}`,
                                })
                                revalidatePath(
                                  `/org/${organizationId}/settings/members`,
                                )
                              })
                            }}
                            title="Resend invitation"
                          >
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Resend invitation</span>
                          </ActionButton>
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

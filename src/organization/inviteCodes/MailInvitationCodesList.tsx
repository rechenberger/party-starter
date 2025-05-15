import { getMyUserOrThrow } from '@/auth/getMyUser'
import { SimpleUserAvatar } from '@/components/simple/SimpleUserAvatar'
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
import { User } from '@/db/schema-zod'
import { ORGS } from '@/lib/starter.config'
import { cn } from '@/lib/utils'
import {
  streamDialog,
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { format, formatDistanceToNow } from 'date-fns'
import { and, desc, eq, or } from 'drizzle-orm'
import { Mail, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import {
  getMyMembershipOrNotFound,
  getMyMembershipOrThrow,
} from '../getMyMembership'
import { OrganizationRole, getOrganizationRole } from '../organizationRoles'
import { sendOrgInviteMail } from '../sendOrgInviteMail'
import { CreateInviteCodeEmailFormClient } from './CreateInviteCodeEmailFormClient'
import { InvitationCodesListProps } from './InvitationCodesList'
import { getInviteCodeUrl } from './getInviteCodeUrl'
import { resolveExpiresAt } from './resolveExpiresAt'

const upsertInviteCodeAndSendMail = async ({
  receiverEmail,
  role,
  user,
  existingCodeId,
  id: organizationId,
  slug: organizationSlug,
  name: organizationName,
}: {
  receiverEmail: string
  user: Pick<User, 'id' | 'email' | 'name'>
} & InvitationCodesListProps &
  (
    | {
        role: OrganizationRole
        existingCodeId?: never
      }
    | {
        role?: OrganizationRole
        existingCodeId: string
      }
  )) => {
  'use server'
  const existingCode = await db
    .select()
    .from(schema.inviteCodes)
    .where(
      or(
        existingCodeId ? eq(schema.inviteCodes.id, existingCodeId) : undefined,
        and(
          eq(schema.inviteCodes.sentToEmail, receiverEmail),
          eq(schema.inviteCodes.organizationId, organizationId),
        ),
      ),
    )
    .orderBy(desc(schema.inviteCodes.createdAt))
    .limit(1)
    .then((res) => res[0])

  if (existingCodeId && !existingCode) {
    throw new Error('No existing code found')
  }

  const newCodeRes = await db
    .insert(schema.inviteCodes)
    .values({
      id: existingCode?.id,
      organizationId: organizationId,
      role: role ?? existingCode.role,
      expiresAt: resolveExpiresAt(ORGS.defaultExpirationEmailInvitation),
      usesMax: 1,
      createdById: user.id,
      updatedById: user.id,
      sentToEmail: receiverEmail,
    })
    .onConflictDoUpdate({
      target: [schema.inviteCodes.id],
      set: {
        role: role ?? existingCode.role,
        usesMax: 1,
        expiresAt: resolveExpiresAt(ORGS.defaultExpirationEmailInvitation),
        deletedAt: null,
        updatedById: user.id,
      },
    })
    .returning({ id: schema.inviteCodes.id, role: schema.inviteCodes.role })

  const newCode = newCodeRes[0]

  await sendOrgInviteMail({
    receiverEmail,
    invitedByEmail: user.email,
    invitedByUsername: user.name,
    orgName: organizationName,
    inviteLink: getInviteCodeUrl({
      organizationSlug: organizationSlug,
      code: newCode.id,
    }),
    role: newCode.role,
  })
}

const allowedRoles: OrganizationRole[] = ['admin']

export const MailInvitationCodesList = async (
  props: InvitationCodesListProps,
) => {
  const { inviteCodes, id: orgId, slug: orgSlug } = props

  await getMyMembershipOrNotFound({
    allowedRoles,
  })

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
                            await getMyMembershipOrThrow({
                              allowedRoles,
                              orgSlug: props.slug,
                            })
                            const me = await getMyUserOrThrow()
                            await Promise.all(
                              data.receiverEmail.map(async (mail) => {
                                await upsertInviteCodeAndSendMail({
                                  receiverEmail: mail,
                                  role: data.role,
                                  user: me,
                                  ...props,
                                })
                              }),
                            )

                            revalidatePath(`/org/${orgId}/settings/members`)

                            streamToast({
                              title: `Invitation sent to ${data.receiverEmail.join(
                                ', ',
                              )}`,
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
                <TableHead>Sent at</TableHead>
                <TableHead>Sent by</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inviteCodes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={42} //just a high number to make sure the cell takes the full width
                    className="text-center py-6 text-muted-foreground"
                  >
                    No invitation codes sent yet.
                  </TableCell>
                </TableRow>
              ) : (
                inviteCodes.map((code) => {
                  const status = code.isCompletelyUsed
                    ? 'Accepted'
                    : code.isExpired
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
                              content: `Are you sure you want to resend the invitation to ${code.sentToEmail}?`,
                            }}
                            action={async () => {
                              'use server'
                              return superAction(async () => {
                                await getMyMembershipOrThrow({
                                  allowedRoles,
                                  orgSlug,
                                })
                                if (!code.sentToEmail) {
                                  throw new Error('No email found')
                                }
                                const me = await getMyUserOrThrow()
                                await upsertInviteCodeAndSendMail({
                                  receiverEmail: code.sentToEmail,
                                  user: me,
                                  existingCodeId: code.id,
                                  ...props,
                                })
                                streamToast({
                                  title: `Invitation sent to ${code.sentToEmail}`,
                                })
                                revalidatePath(`/org/${orgId}/settings/members`)
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
                                const { membership } =
                                  await getMyMembershipOrThrow({
                                    allowedRoles,
                                    orgSlug,
                                  })
                                await db
                                  .update(schema.inviteCodes)
                                  .set({
                                    updatedById: membership.userId,
                                    deletedAt: new Date(),
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

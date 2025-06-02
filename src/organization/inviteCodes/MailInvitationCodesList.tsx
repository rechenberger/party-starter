import { getMyUserOrThrow } from '@/auth/getMyUser'
import { UserAvatar } from '@/components/UserAvatar'
import { DateFnsFormatDistanceToNow } from '@/components/date-fns-client/DateFnsFormatDistanceToNow'
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
import { getTranslations } from '@/i18n/getTranslations'
import { ORGS } from '@/lib/starter.config'
import { superCache } from '@/lib/superCache'
import { cn } from '@/lib/utils'
import {
  streamDialog,
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { OrgInvite } from '@emails/OrgInvite'
import { and, desc, eq, or } from 'drizzle-orm'
import { Mail, Trash2 } from 'lucide-react'
import {
  getMyMembershipOrNotFound,
  getMyMembershipOrThrow,
} from '../getMyMembership'
import { OrganizationRole, getOrganizationRole } from '../organizationRoles'
import { CreateInviteCodeEmailFormClient } from './CreateInviteCodeEmailFormClient'
import { InvitationCodesListProps } from './InvitationCodesList'
import { getInviteCodeUrl } from './getInviteCodeUrl'
import { resolveExpiresAt } from './resolveExpiresAt'

const upsertInviteCodeAndSendMail = async ({
  receiverEmail,
  role,
  user,
  existingCodeId,
  id: orgId,
  slug: orgSlug,
  name: orgName,
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
          eq(schema.inviteCodes.organizationId, orgId),
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
      organizationId: orgId,
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

  superCache.orgMembers({ orgId }).revalidate()
  const newCode = newCodeRes[0]

  await OrgInvite.send({
    to: receiverEmail,
    props: {
      invitedByEmail: user.email,
      invitedByUsername: user.name,
      orgName: orgName,
      inviteLink: getInviteCodeUrl({
        organizationSlug: orgSlug,
        code: newCode.id,
      }),
      role: newCode.role,
    },
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
  const t = await getTranslations()

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t.inviteCodes.mailInvitations.title}</CardTitle>
          <div className="flex gap-2">
            <ActionButton
              size="sm"
              icon={<Mail className="h-4 w-4" />}
              action={async () => {
                'use server'
                return superAction(async () => {
                  const t = await getTranslations()
                  return streamDialog({
                    title: t.inviteCodes.mailInvitations.create,
                    content: (
                      <CreateInviteCodeEmailFormClient
                        action={async (data) => {
                          'use server'
                          return superAction(async () => {
                            const t = await getTranslations()
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

                            streamToast({
                              title:
                                t.inviteCodes.mailInvitations.createSuccess(
                                  data.receiverEmail.join(', '),
                                ),
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
              {t.inviteCodes.mailInvitations.create}
            </ActionButton>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.inviteCodes.table.receiver}</TableHead>
                <TableHead>{t.inviteCodes.table.status}</TableHead>
                <TableHead>{t.inviteCodes.table.role}</TableHead>
                <TableHead>{t.inviteCodes.table.sentAt}</TableHead>
                <TableHead>{t.inviteCodes.table.sentBy}</TableHead>
                <TableHead className="text-right">
                  {t.inviteCodes.table.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inviteCodes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={42} //just a high number to make sure the cell takes the full width
                    className="text-center py-6 text-muted-foreground"
                  >
                    {t.inviteCodes.table.noMailInvitations}
                  </TableCell>
                </TableRow>
              ) : (
                inviteCodes.map((code) => {
                  const status = code.isCompletelyUsed
                    ? t.inviteCodes.status.accepted
                    : code.isExpired
                      ? t.inviteCodes.status.expired
                      : t.inviteCodes.status.pending
                  return (
                    <TableRow key={code.id}>
                      <TableCell className={cn()}>{code.sentToEmail}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            code.isCompletelyUsed
                              ? 'default'
                              : code.isExpired
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
                          {t.roles[getOrganizationRole(code.role).i18nKey]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DateFnsFormatDistanceToNow
                          date={code.updatedAt}
                          options={{
                            addSuffix: true,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {code.updatedBy && (
                          <div className="flex items-center gap-3">
                            <UserAvatar user={code.updatedBy} />
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
                          <span className="text-muted-foreground">
                            {t.standardWords.unknown}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <ActionButton
                            variant="ghost"
                            size="icon"
                            catchToast
                            hideIcon
                            askForConfirmation={{
                              title:
                                t.inviteCodes.mailInvitations.resendConfirmation
                                  .title,
                              content:
                                t.inviteCodes.mailInvitations.resendConfirmation.content(
                                  code.sentToEmail ?? '',
                                ),
                            }}
                            action={async () => {
                              'use server'
                              return superAction(async () => {
                                const t = await getTranslations()
                                await getMyMembershipOrThrow({
                                  allowedRoles,
                                  orgSlug,
                                })
                                if (!code.sentToEmail) {
                                  throw new Error(
                                    t.inviteCodes.mailInvitations.noEmailFound,
                                  )
                                }
                                const me = await getMyUserOrThrow()
                                await upsertInviteCodeAndSendMail({
                                  receiverEmail: code.sentToEmail,
                                  user: me,
                                  existingCodeId: code.id,
                                  ...props,
                                })
                                streamToast({
                                  title:
                                    t.inviteCodes.mailInvitations.createSuccess(
                                      code.sentToEmail,
                                    ),
                                })
                              })
                            }}
                            title={
                              t.inviteCodes.mailInvitations.resendConfirmation
                                .title
                            }
                          >
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">
                              {
                                t.inviteCodes.mailInvitations.resendConfirmation
                                  .title
                              }
                            </span>
                          </ActionButton>
                          <ActionButton
                            variant="ghost"
                            size="icon"
                            // disabled={isDeleting}
                            catchToast
                            hideIcon
                            askForConfirmation={
                              t.inviteCodes.delete.confirmation
                            }
                            action={async () => {
                              'use server'
                              return superAction(async () => {
                                const t = await getTranslations()
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
                                superCache.orgMembers({ orgId }).revalidate()
                              })
                            }}
                            title={t.inviteCodes.delete.action}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">
                              {t.inviteCodes.delete.action}
                            </span>
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

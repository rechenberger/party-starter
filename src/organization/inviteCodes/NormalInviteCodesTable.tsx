import { CopyToClipboardButton } from '@/components/CopyToClipboardButton'
import { DateFnsFormatDistanceToNow } from '@/components/date-fns-client/DateFnsFormatDistanceToNow'
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
import { getTranslations } from '@/i18n/getTranslations'
import { superCache } from '@/lib/superCache'
import { cn } from '@/lib/utils'
import {
  streamDialog,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { eq } from 'drizzle-orm'
import { Info, PlusCircle, Trash2 } from 'lucide-react'
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
  const t = await getTranslations()

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t.inviteCodes.normalCodes.title}</CardTitle>
          <div className="flex gap-2">
            <ActionButton
              size="sm"
              icon={<PlusCircle className="mr-2 h-4 w-4" />}
              action={async () => {
                'use server'
                return superAction(async () => {
                  return streamDialog({
                    title: t.inviteCodes.normalCodes.create,
                    description: t.inviteCodes.normalCodes.createDescription,
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

                            superCache.orgMembers({ orgId }).revalidate()

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
              {t.inviteCodes.normalCodes.create}
            </ActionButton>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.inviteCodes.table.code}</TableHead>
                <TableHead>{t.inviteCodes.table.role}</TableHead>
                <TableHead>{t.inviteCodes.table.expires}</TableHead>
                <TableHead>{t.inviteCodes.table.usesLeft}</TableHead>
                <TableHead>{t.inviteCodes.table.updatedBy}</TableHead>
                <TableHead>{t.inviteCodes.table.comment}</TableHead>
                <TableHead className="text-right">
                  {t.inviteCodes.table.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inviteCodes.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-center py-6 text-muted-foreground"
                    colSpan={42} //just a high number to make sure the cell takes the full width
                  >
                    {t.inviteCodes.table.noInvitationCodes}
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
                          {t.roles[getOrganizationRole(code.role).i18nKey]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {code.expiresAt ? (
                          <DateFnsFormatDistanceToNow
                            date={code.expiresAt}
                            options={{
                              addSuffix: true,
                            }}
                          />
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
                          <span className="text-muted-foreground">
                            {t.standardWords.unknown}
                          </span>
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
                            askForConfirmation={
                              t.inviteCodes.delete.confirmation
                            }
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

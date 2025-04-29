import { CopyToClipboardButton } from '@/components/CopyToClipboardButton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
import {
  streamDialog,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { addDays, addMonths, addYears, format } from 'date-fns'
import { eq } from 'drizzle-orm'
import { PlusCircle, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { CreateInviteCodeFormClient } from './CreateInviteCodeFormClient'

// Define the invitation code type
type InvitationCode = {
  id: string
  role: 'admin' | 'member'
  expiresAt: Date | null
  maxUses: number | null
  currentUses: number | null
  createdAt: Date
}

export const InvitationCodesList = ({
  organization,
}: {
  organization: {
    inviteCodes: InvitationCode[]
    id: string
    slug: string
  }
}) => {
  const {
    inviteCodes,
    id: organizationId,
    slug: organizationSlug,
  } = organization
  // Mock function to copy code to clipboard
  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        console.log(`Copied code: ${code}`)
        // In a real app, you would show a toast notification here
      })
      .catch((err) => {
        console.error('Failed to copy code: ', err)
      })
  }

  // // Mock function to delete an invitation code
  // const deleteInvitationCode = (id: string) => {
  //   setInvitationCodes((prevCodes) =>
  //     prevCodes.filter((code) => code.id !== id),
  //   )
  //   // In a real app, you would make an API call here
  // }

  // Mock function to create a new invitation code

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
                            case '1d':
                              expiresAtResolved = addDays(new Date(), 1)
                            case '1w':
                              expiresAtResolved = addDays(new Date(), 7)
                            case '1m':
                              expiresAtResolved = addMonths(new Date(), 1)
                            case '1y':
                              expiresAtResolved = addYears(new Date(), 1)
                          }
                          await db.insert(schema.inviteCodes).values({
                            organizationId: organizationId,
                            role: data.role,
                            expiresAt: expiresAtResolved,
                            maxUses: data.maxUses,
                          })
                          revalidatePath(
                            `/org/${organizationId}/settings/members`,
                          )
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
                <TableHead>Uses</TableHead>
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
                inviteCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-mono">{code.id}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          code.role === 'admin' ? 'default' : 'secondary'
                        }
                      >
                        {code.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {code.expiresAt ? (
                        format(code.expiresAt, 'MMM d, yyyy HH:mm')
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{code.currentUses ?? 0}</span>
                          {code.maxUses ? (
                            <span className="text-muted-foreground">
                              of {code.maxUses}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">∞</span>
                          )}
                        </div>
                        {code.maxUses ? (
                          <Progress
                            value={(code.currentUses ?? 0 / code.maxUses) * 100}
                            className="h-2"
                          />
                        ) : (
                          <div className="h-2"></div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <CopyToClipboardButton text={code.id} />
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
                                .delete(schema.inviteCodes)
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

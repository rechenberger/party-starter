import { notFoundIfNotAdmin } from '@/auth/getIsAdmin'
import { TopHeader } from '@/components/TopHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import { shouldActuallySendEmails } from '@/lib/email-delivery'
import {
  superAction,
  type SuperActionDialog,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { desc, eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { EmailDeliveryBadge } from '../EmailDeliveryBadge'

export const generateMetadata = async () => {
  const t = await getTranslations()
  return {
    title: t.emailsLog.settings.title,
  } satisfies Metadata
}

export default async function EmailSettingsPage() {
  await notFoundIfNotAdmin({ allowDev: true })
  const t = await getTranslations()
  const enabled = shouldActuallySendEmails()

  const entries = await db
    .select()
    .from(schema.emailAllowlist)
    .orderBy(desc(schema.emailAllowlist.createdAt))

  const statusDescription = enabled
    ? t.emailsLog.settings.statusEnabled
    : entries.length > 0
      ? t.emailsLog.settings.statusPartiallyEnabled
      : t.emailsLog.settings.statusDisabled

  const addPatternAction = async (formData: FormData) => {
    'use server'
    const pattern = (formData.get('pattern') as string)?.trim()
    if (!pattern) return
    await db
      .insert(schema.emailAllowlist)
      .values({ pattern })
      .onConflictDoNothing()
    revalidatePath('/admin/emails/settings')
  }

  return (
    <>
      <TopHeader>
        <CardTitle>{t.emailsLog.settings.title}</CardTitle>
      </TopHeader>

      <Card>
        <CardHeader>
          <CardTitle>{t.emailsLog.settings.statusTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <EmailDeliveryBadge />
          <p className="text-sm text-muted-foreground">{statusDescription}</p>
          <p className="text-xs text-muted-foreground">
            {t.emailsLog.settings.envVarHint}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.emailsLog.settings.allowlist.title}</CardTitle>
          <CardDescription>
            {t.emailsLog.settings.allowlist.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={addPatternAction} className="flex gap-2">
            <Input
              name="pattern"
              placeholder={t.emailsLog.settings.allowlist.patternPlaceholder}
              required
            />
            <Button type="submit">{t.emailsLog.settings.allowlist.add}</Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.emailsLog.settings.allowlist.pattern}</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center py-6 text-muted-foreground"
                  >
                    {t.emailsLog.settings.allowlist.noEntries}
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Badge variant="secondary">{entry.pattern}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        variant="ghost"
                        size="sm"
                        askForConfirmation={
                          {
                            title:
                              t.emailsLog.settings.allowlist.deleteConfirmation
                                .title,
                            description:
                              t.emailsLog.settings.allowlist.deleteConfirmation.content(
                                entry.pattern,
                              ),
                            confirm:
                              t.emailsLog.settings.allowlist.deleteConfirmation
                                .confirm,
                          } satisfies SuperActionDialog
                        }
                        catchToast
                        action={async () => {
                          'use server'
                          return superAction(async () => {
                            await db
                              .delete(schema.emailAllowlist)
                              .where(eq(schema.emailAllowlist.id, entry.id))
                            revalidatePath('/admin/emails/settings')
                          })
                        }}
                      >
                        {t.emailsLog.settings.allowlist.delete}
                      </ActionButton>
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

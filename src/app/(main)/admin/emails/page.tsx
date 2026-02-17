import { notFoundIfNotAdmin } from '@/auth/getIsAdmin'
import { TopHeader } from '@/components/TopHeader'
import { DateFnsFormat } from '@/components/date-fns-client/DateFnsFormat'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import type { EmailLogStatus } from '@/db/schema-email-log'
import { getTranslations } from '@/i18n/getTranslations'
import { and, desc, eq, ilike, type SQL } from 'drizzle-orm'
import type { Metadata } from 'next'
import Link from 'next/link'
import { EmailDeliveryBadge } from './EmailDeliveryBadge'

export const generateMetadata = async () => {
  const t = await getTranslations()
  return {
    title: t.emailsLog.title,
  } satisfies Metadata
}

const getStatusVariant = (status: EmailLogStatus) => {
  if (status === 'sent') return 'default'
  if (status === 'failed') return 'destructive'
  return 'secondary'
}

export default async function AdminEmailsPage({
  searchParams,
}: {
  searchParams: Promise<{
    id?: string
    status?: string
    template?: string
    to?: string
    runId?: string
  }>
}) {
  await notFoundIfNotAdmin({ allowDev: true })
  const t = await getTranslations()
  const params = await searchParams

  const selectedStatus = schema.EmailLogStatus.safeParse(params.status)
  const statusFilter = selectedStatus.success ? selectedStatus.data : undefined
  const templateFilter = params.template?.trim() || undefined
  const toFilter = params.to?.trim() || undefined
  const runIdFilter = params.runId?.trim() || undefined
  const selectedId = params.id?.trim() || undefined

  const conditions: SQL<unknown>[] = [
    statusFilter ? eq(schema.emailLog.status, statusFilter) : undefined,
    templateFilter ? eq(schema.emailLog.template, templateFilter) : undefined,
    toFilter ? ilike(schema.emailLog.toEmail, `%${toFilter}%`) : undefined,
    runIdFilter ? eq(schema.emailLog.runId, runIdFilter) : undefined,
  ].filter((value): value is SQL<unknown> => !!value)

  const emails = await db
    .select({
      id: schema.emailLog.id,
      createdAt: schema.emailLog.createdAt,
      template: schema.emailLog.template,
      toEmail: schema.emailLog.toEmail,
      subject: schema.emailLog.subject,
      status: schema.emailLog.status,
      sentAt: schema.emailLog.sentAt,
      runId: schema.emailLog.runId,
      errorText: schema.emailLog.errorText,
    })
    .from(schema.emailLog)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(schema.emailLog.createdAt))
    .limit(100)

  const selectedEmail = selectedId
    ? await db.query.emailLog.findFirst({
        where: eq(schema.emailLog.id, selectedId),
      })
    : undefined

  const queryWithSelection = (id: string) => {
    const urlParams = new URLSearchParams()
    if (statusFilter) urlParams.set('status', statusFilter)
    if (templateFilter) urlParams.set('template', templateFilter)
    if (toFilter) urlParams.set('to', toFilter)
    if (runIdFilter) urlParams.set('runId', runIdFilter)
    urlParams.set('id', id)
    return `/admin/emails?${urlParams.toString()}`
  }

  return (
    <>
      <TopHeader>
        <CardTitle>{t.emailsLog.title}</CardTitle>
        <div className="ml-auto">
          <EmailDeliveryBadge />
        </div>
      </TopHeader>

      <Card>
        <CardHeader>
          <CardTitle>{t.emailsLog.filters.title}</CardTitle>
          <CardDescription>{t.emailsLog.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action="/admin/emails"
            method="GET"
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="to" className="text-sm text-muted-foreground">
                {t.emailsLog.filters.to}
              </label>
              <Input
                id="to"
                name="to"
                defaultValue={toFilter}
                placeholder={t.emailsLog.filters.toPlaceholder}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="template"
                className="text-sm text-muted-foreground"
              >
                {t.emailsLog.filters.template}
              </label>
              <Input
                id="template"
                name="template"
                defaultValue={templateFilter}
                placeholder={t.emailsLog.filters.templatePlaceholder}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="runId" className="text-sm text-muted-foreground">
                {t.emailsLog.filters.runId}
              </label>
              <Input
                id="runId"
                name="runId"
                defaultValue={runIdFilter}
                placeholder={t.emailsLog.filters.runIdPlaceholder}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="status" className="text-sm text-muted-foreground">
                {t.emailsLog.filters.status}
              </label>
              <select
                id="status"
                name="status"
                defaultValue={statusFilter ?? ''}
                className="border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
              >
                <option value="">{t.emailsLog.filters.statusAny}</option>
                {schema.EmailLogStatus.options.map((status) => (
                  <option key={status} value={status}>
                    {t.emailsLog.status[status]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit">{t.emailsLog.filters.apply}</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/emails">{t.emailsLog.filters.clear}</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className={selectedEmail ? 'grid gap-4 xl:grid-cols-2' : ''}>
        <Card>
          <CardHeader>
            <CardTitle>{t.emailsLog.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.emailsLog.table.createdAt}</TableHead>
                  <TableHead>{t.emailsLog.table.template}</TableHead>
                  <TableHead>{t.emailsLog.table.to}</TableHead>
                  <TableHead>{t.emailsLog.table.subject}</TableHead>
                  <TableHead>{t.emailsLog.table.status}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={42}
                      className="text-center py-6 text-muted-foreground"
                    >
                      {t.emailsLog.table.noEmailsFound}
                    </TableCell>
                  </TableRow>
                ) : (
                  emails.map((email) => (
                    <TableRow
                      key={email.id}
                      className="cursor-pointer"
                      data-state={selectedId === email.id ? 'selected' : undefined}
                    >
                      <TableCell className="text-nowrap">
                        <Link
                          href={queryWithSelection(email.id)}
                          className="block"
                        >
                          <DateFnsFormat
                            date={email.createdAt}
                            format="Ppp"
                          />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={queryWithSelection(email.id)}
                          className="block"
                        >
                          {email.template}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={queryWithSelection(email.id)}
                          className="block"
                        >
                          {email.toEmail}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={queryWithSelection(email.id)}
                          className="block"
                        >
                          {email.subject}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={queryWithSelection(email.id)}
                          className="block"
                        >
                          <Badge variant={getStatusVariant(email.status)}>
                            {t.emailsLog.status[email.status]}
                          </Badge>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {!!selectedId && (
          <Card>
            <CardHeader>
              <CardTitle>{t.emailsLog.detail.title}</CardTitle>
              <CardDescription>
                {t.emailsLog.detail.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedEmail && (
                <p className="text-sm text-muted-foreground">
                  {t.emailsLog.detail.notFound}
                </p>
              )}

            {!!selectedEmail && (
              <>
                <div className="grid gap-2 text-sm">
                  <div>
                    <strong>{t.emailsLog.detail.template}:</strong>{' '}
                    {selectedEmail.template}
                  </div>
                  <div>
                    <strong>{t.emailsLog.detail.status}:</strong>{' '}
                    <Badge variant={getStatusVariant(selectedEmail.status)}>
                      {t.emailsLog.status[selectedEmail.status]}
                    </Badge>
                  </div>
                  <div>
                    <strong>{t.emailsLog.detail.from}:</strong>{' '}
                    {selectedEmail.fromEmail}
                  </div>
                  <div>
                    <strong>{t.emailsLog.detail.to}:</strong>{' '}
                    {selectedEmail.toEmail}
                  </div>
                  <div>
                    <strong>{t.emailsLog.detail.provider}:</strong>{' '}
                    {selectedEmail.provider}
                  </div>
                  <div>
                    <strong>{t.emailsLog.detail.locale}:</strong>{' '}
                    {selectedEmail.locale}
                  </div>
                  <div>
                    <strong>{t.emailsLog.detail.runId}:</strong>{' '}
                    {selectedEmail.runId ?? t.emailsLog.unknown}
                  </div>
                  <div>
                    <strong>{t.emailsLog.detail.sentAt}:</strong>{' '}
                    {selectedEmail.sentAt ? (
                      <DateFnsFormat date={selectedEmail.sentAt} format="Ppp" />
                    ) : (
                      t.emailsLog.notSentYet
                    )}
                  </div>
                  <div>
                    <strong>{t.emailsLog.detail.error}:</strong>{' '}
                    {selectedEmail.errorText ?? t.emailsLog.noError}
                  </div>
                </div>

                <Tabs defaultValue="preview">
                  <TabsList>
                    <TabsTrigger value="preview">
                      {t.emailsLog.detail.htmlPreview}
                    </TabsTrigger>
                    <TabsTrigger value="text">
                      {t.emailsLog.detail.text}
                    </TabsTrigger>
                    <TabsTrigger value="html">
                      {t.emailsLog.detail.html}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview">
                    <iframe
                      title={t.emailsLog.detail.htmlPreview}
                      srcDoc={selectedEmail.html}
                      sandbox=""
                      className="w-full min-h-[40rem] rounded-md border"
                    />
                  </TabsContent>
                  <TabsContent value="text">
                    <Textarea
                      readOnly
                      value={selectedEmail.text}
                      className="min-h-44 font-mono"
                    />
                  </TabsContent>
                  <TabsContent value="html">
                    <Textarea
                      readOnly
                      value={selectedEmail.html}
                      className="min-h-44 font-mono"
                    />
                  </TabsContent>
                </Tabs>
              </>
            )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

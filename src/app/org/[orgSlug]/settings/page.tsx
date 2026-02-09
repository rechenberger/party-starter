import { TopHeader } from '@/components/TopHeader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { getTranslations } from '@/i18n/getTranslations'
import { superCache } from '@/lib/superCache'
import {
  getMyMembershipOrNotFound,
  getMyMembershipOrThrow,
} from '@/organization/getMyMembership'
import { OrganizationRole } from '@/organization/organizationRoles'
import { ActionButton } from '@/super-action/button/ActionButton'
import { eq } from 'drizzle-orm'
import { AlertTriangle } from 'lucide-react'
import { redirect } from 'next/navigation'

const allowedRoles: OrganizationRole[] = ['admin']

export default async function Page({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const { org } = await getMyMembershipOrNotFound({
    allowedRoles,
    orgSlug,
  })
  const t = await getTranslations()

  return (
    <>
      <TopHeader>{t.org.settingsTopHeader(org.name)}</TopHeader>

      <div className="flex flex-row gap-4 justify-center">
        <div className="flex flex-col gap-4 max-w-2xl">
          <h2 className="text-lg font-semibold">
            {t.org.deleteOrg.dangerZone}
          </h2>
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="size-5" />
                {t.org.deleteOrg.delete}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Alert variant="destructive">
                <AlertDescription>
                  {t.org.deleteOrg.description}
                </AlertDescription>
              </Alert>
              <div className="flex justify-end">
                <ActionButton
                  variant="destructive"
                  action={async () => {
                    'use server'
                    await getMyMembershipOrThrow({
                      allowedRoles,
                      orgSlug: org.slug,
                    })

                    await db
                      .delete(schema.organizations)
                      .where(eq(schema.organizations.slug, org.slug))

                    superCache.all().revalidate()

                    redirect('/')
                  }}
                  askForConfirmation={{
                    title: t.org.deleteOrg.confirmation.title,
                    content: t.org.deleteOrg.confirmation.content(org.name),
                    confirm: t.org.deleteOrg.confirmation.confirm,
                  }}
                >
                  {t.org.deleteOrg.delete}
                </ActionButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

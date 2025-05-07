import { TopHeader } from '@/components/TopHeader'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { ParamsWrapper } from '@/lib/paramsServerContext'
import { getCurrentOrg } from '@/organization/getCurrentOrg'
import {
  getMyMembershipOrNotFound,
  getMyMembershipOrThrow,
} from '@/organization/getMyMembership'
import { ActionButton } from '@/super-action/button/ActionButton'
import { eq } from 'drizzle-orm'
import { AlertTriangle } from 'lucide-react'
import { redirect } from 'next/navigation'

const allowedRoles: schema.OrganizationRole[] = ['admin']

export default ParamsWrapper(
  async ({ params }: { params: Promise<{ orgSlug: string }> }) => {
    const { orgSlug } = await params
    await getMyMembershipOrNotFound({
      allowedRoles,
    })

    const org = await getCurrentOrg()

    return (
      <>
        <TopHeader>Organization Settings for {org.name}</TopHeader>

        <div className="flex flex-row gap-4 justify-center">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h2 className="text-lg font-semibold">Danger Zone</h2>
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="size-5" />
                  Delete Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Alert variant="destructive">
                  <AlertDescription>
                    This action cannot be undone. This will permanently delete
                    the organization and remove all access for all team members.
                  </AlertDescription>
                </Alert>
                <div className="flex justify-end">
                  <ActionButton
                    variant="destructive"
                    action={async () => {
                      'use server'
                      await getMyMembershipOrThrow({
                        allowedRoles,
                      })

                      await db
                        .delete(schema.organizations)
                        .where(eq(schema.organizations.slug, orgSlug))

                      redirect('/')
                    }}
                    askForConfirmation={{
                      title: 'Delete Organization',
                      content: `Are you sure you want to delete ${org.name}? This action cannot be undone.`,
                      confirm: 'Delete Organization',
                      cancel: 'Cancel',
                    }}
                  >
                    Delete Organization
                  </ActionButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  },
)

import { getMyUserIdOrThrow } from '@/auth/getMyUser'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { getTranslations } from '@/i18n/getTranslations'
import { slugify } from '@/lib/slugify'
import { ORGS } from '@/lib/starter.config'
import { superCache } from '@/lib/superCache'
import { canUserCreateOrg } from '@/organization/canUserCreateOrg'
import { superAction } from '@/super-action/action/createSuperAction'
import { notFound, redirect } from 'next/navigation'
import { CreateOrgFormClient } from './CreateOrgFormClient'
import { NameSchema } from './NameSchema'

export default async function CreateOrg() {
  if (!ORGS.isActive) {
    redirect('/')
  }

  const userCanCreateOrg = await canUserCreateOrg()

  if (!userCanCreateOrg) {
    notFound()
  }

  const t = await getTranslations()

  return (
    <>
      <CreateOrgFormClient
        action={async (data) => {
          'use server'
          return superAction(async () => {
            const parsed = NameSchema.safeParse(data.name)
            if (!parsed.success) {
              throw new Error(parsed.error.message)
            }
            const name = parsed.data

            const userCanCreateOrg = await canUserCreateOrg()
            if (!userCanCreateOrg) {
              throw new Error(t.org.missingPermission)
            }

            const userId = await getMyUserIdOrThrow()

            const [org] = await db
              .insert(schema.organizations)
              .values({
                name,
                slug: slugify(name),
              })
              .returning()

            await db.insert(schema.organizationMemberships).values({
              userId,
              organizationId: org.id,
              role: 'admin',
            })

            superCache.org({ id: org.id }).update()
            superCache.orgMembers({ orgId: org.id }).update()
            superCache.userOrgMemberships({ userId }).update()

            redirect(`/org/${org.slug}`)
          })
        }}
      />
    </>
  )
}

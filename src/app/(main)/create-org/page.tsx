import { getMyUserIdOrThrow } from '@/auth/getMyUser'
import { db } from '@/db/db'
import * as schema from '@/db/schema'
import { slugify } from '@/lib/slugify'
import { ORGS } from '@/lib/starter.config'
import { canUserCreateOrg } from '@/organization/canUserCreateOrg'
import { superAction } from '@/super-action/action/createSuperAction'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { CreateOrgFormClient } from './CreateOrgFormClient'

export default async function CreateOrg() {
  if (!ORGS.isActive) {
    redirect('/')
  }

  const userCanCreateOrg = await canUserCreateOrg()

  if (!userCanCreateOrg) {
    notFound()
  }

  return (
    <>
      <CreateOrgFormClient
        action={async (data) => {
          'use server'
          return superAction(async () => {
            const userCanCreateOrg = await canUserCreateOrg()
            if (!userCanCreateOrg) {
              throw new Error('User cannot create org')
            }

            const userId = await getMyUserIdOrThrow()

            const [org] = await db
              .insert(schema.organizationsTable)
              .values({
                name: data.name,
                slug: slugify(data.name),
              })
              .returning()

            await db.insert(schema.organizationMembershipsTable).values({
              userId,
              organizationId: org.id,
              role: 'admin',
            })

            revalidatePath('/', 'layout')
            redirect(`/org/${org.slug}`)
          })
        }}
      />
    </>
  )
}

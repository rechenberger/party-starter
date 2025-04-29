import { TopHeader } from '@/components/TopHeader'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import {
  getMyMembershipOrNotFound,
  getMyMembershipOrThrow,
} from '@/organization/getMyMembership'
import { MemberList } from '@/organization/MemberList'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

const allowedRoles: schema.OrganizationRole[] = ['admin', 'member']

export default async function OrgSettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const orgSlug = (await params).orgSlug
  await getMyMembershipOrNotFound({
    allowedRoles,
  })

  const organizations = await db.query.organizations.findMany({
    where: eq(schema.organizations.slug, orgSlug),
    with: {
      memberships: {
        columns: {
          createdAt: true,
          role: true,
          userId: true,
          // invitationCodeId: true,
        },
        with: {
          // invitationCode: true,
          user: {
            columns: {
              id: true,
              email: true,
              emailVerified: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  })

  const changeRoleAction = async (data: {
    userId: string
    role: schema.OrganizationRole
  }) => {
    'use server'

    await getMyMembershipOrThrow({
      allowedRoles,
    })
    await db
      .update(schema.organizationMemberships)
      .set({
        role: data.role,
      })
      .where(eq(schema.organizationMemberships.userId, data.userId))

    revalidatePath(`/org/${orgSlug}/settings/members`)
  }
  const kickUserAction = async (data: { userId: string }) => {
    'use server'

    await getMyMembershipOrThrow({
      allowedRoles,
    })
    await db
      .delete(schema.organizationMemberships)
      .where(eq(schema.organizationMemberships.userId, data.userId))

    revalidatePath(`/org/${orgSlug}/settings/members`)
  }

  return (
    <>
      <TopHeader>Organization Members for {orgSlug}</TopHeader>
      <MemberList
        organizations={organizations}
        changeRoleAction={changeRoleAction}
        kickUserAction={kickUserAction}
      />
    </>
  )
}

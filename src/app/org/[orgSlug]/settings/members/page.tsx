import { getMyUserId } from '@/auth/getMyUser'
import { TopHeader } from '@/components/TopHeader'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import {
  getMyMembershipOrNotFound,
  getMyMembershipOrThrow,
} from '@/organization/getMyMembership'
import { InvitationCodesList } from '@/organization/InvitationCodesList'
import { MemberList } from '@/organization/MemberList'
import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const allowedRolesView: schema.OrganizationRole[] = ['admin', 'member']
const allowedRolesEdit: schema.OrganizationRole[] = ['admin']

export default async function OrgSettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const orgSlug = (await params).orgSlug
  const myMembership = await getMyMembershipOrNotFound({
    allowedRoles: allowedRolesView,
  })

  const isAdmin = myMembership.role === 'admin'

  const organization = await db.query.organizations.findFirst({
    where: eq(schema.organizations.slug, orgSlug),
    with: {
      inviteCodes: {
        with: {
          createdBy: {
            columns: {
              name: true,
              image: true,
              email: true,
            },
          },
        },
        orderBy: [desc(schema.inviteCodes.createdAt)],
      },
      memberships: {
        columns: {
          createdAt: true,
          role: true,
          userId: true,
          // invitationCodeId: true,
        },
        orderBy: [
          desc(schema.organizationMemberships.role),
          desc(schema.organizationMemberships.createdAt),
        ],
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
      allowedRoles: allowedRolesEdit,
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

    const myUserId = await getMyUserId()

    if (myUserId !== data.userId) {
      await getMyMembershipOrThrow({
        allowedRoles: allowedRolesEdit,
      })
    }

    await db
      .delete(schema.organizationMemberships)
      .where(eq(schema.organizationMemberships.userId, data.userId))

    revalidatePath(`/org/${orgSlug}/settings/members`)
    if (myUserId === data.userId) {
      redirect(`/`)
    }
  }

  return (
    <>
      <TopHeader>Organization Members for {orgSlug}</TopHeader>
      {organization && (
        <>
          <MemberList
            organization={organization}
            changeRoleAction={changeRoleAction}
            kickUserAction={kickUserAction}
            isAdmin={isAdmin}
          />
          {isAdmin && <InvitationCodesList organization={organization} />}
        </>
      )}
    </>
  )
}

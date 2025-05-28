'use server'

import { getMyUserId } from '@/auth/getMyUser'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { getTranslations } from '@/i18n/getTranslations'
import { superCache } from '@/lib/superCache'
import {
  getMyMembership,
  getMyMembershipOrThrow,
} from '@/organization/getMyMembership'
import { OrganizationRole } from '@/organization/organizationRoles'
import { superAction } from '@/super-action/action/createSuperAction'
import { and, eq } from 'drizzle-orm'
import { includes } from 'lodash-es'
import { redirect } from 'next/navigation'

const allowedRolesEdit: OrganizationRole[] = ['admin']

export const changeRoleAction = async (data: {
  userId: string
  role: OrganizationRole
  orgSlug: string
}) => {
  'use server'
  return superAction(async () => {
    const { membership, org } = await getMyMembershipOrThrow({
      allowedRoles: allowedRolesEdit,
      orgSlug: data.orgSlug,
    })

    const t = await getTranslations()

    const currentAdmins = await db
      .select()
      .from(schema.organizationMemberships)
      .where(
        and(
          eq(schema.organizationMemberships.role, 'admin'),
          eq(schema.organizationMemberships.organizationId, org.id),
        ),
      )

    if (
      currentAdmins.length === 1 &&
      data.role === 'member' &&
      data.userId === currentAdmins[0].userId
    ) {
      throw new Error(t.org.leave.cannotRemoveLastAdmin)
    }

    await db
      .update(schema.organizationMemberships)
      .set({
        role: data.role,
        updatedById: membership.userId,
      })
      .where(
        and(
          eq(schema.organizationMemberships.userId, data.userId),
          eq(schema.organizationMemberships.organizationId, org.id),
        ),
      )

    superCache.orgMembers({ orgId: org.id }).revalidate()
    superCache.userOrgMemberships({ userId: data.userId }).revalidate()
  })
}

export const kickUserAction = async (data: {
  userId: string
  orgSlug: string
}) => {
  'use server'

  return superAction(async () => {
    const myUserId = await getMyUserId()

    const myMembership = await getMyMembership({
      orgSlug: data.orgSlug,
    })

    const t = await getTranslations()

    if (!myMembership) {
      throw new Error(t.org.missingPermission)
    }
    const { org, membership } = myMembership

    // only check if admin when kicking other users. Leaving the org is available to all members.
    if (
      myUserId !== data.userId &&
      !includes(allowedRolesEdit, membership.role)
    ) {
      throw new Error(t.org.missingPermission)
    }

    const currentAdmins = await db
      .select()
      .from(schema.organizationMemberships)
      .where(
        and(
          eq(schema.organizationMemberships.role, 'admin'),
          eq(schema.organizationMemberships.organizationId, org.id),
        ),
      )

    if (currentAdmins.length === 1 && data.userId === currentAdmins[0].userId) {
      throw new Error(
        `${t.org.leave.cannotRemoveLastAdmin} ${t.org.leave.cannotRemoveLastAdminDescription}`,
      )
    }

    await db
      .delete(schema.organizationMemberships)
      .where(
        and(
          eq(schema.organizationMemberships.userId, data.userId),
          eq(schema.organizationMemberships.organizationId, org.id),
        ),
      )

    superCache.orgMembers({ orgId: org.id }).revalidate()
    superCache.userOrgMemberships({ userId: data.userId }).revalidate()

    if (myUserId === data.userId) {
      redirect(`/`)
    }
  })
}

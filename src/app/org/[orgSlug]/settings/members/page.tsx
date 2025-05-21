import { getMyUserId } from '@/auth/getMyUser'
import { TopHeader } from '@/components/TopHeader'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { getTranslations } from '@/i18n/getTranslations'
import { ParamsWrapper } from '@/lib/paramsServerContext'
import {
  getMyMembershipOrNotFound,
  getMyMembershipOrThrow,
} from '@/organization/getMyMembership'
import { getEnhancedInviteCode } from '@/organization/inviteCodes/getInviteCode'
import { InvitationCodesList } from '@/organization/inviteCodes/InvitationCodesList'
import { MemberList } from '@/organization/MemberList'
import { OrganizationRole } from '@/organization/organizationRoles'
import { superAction } from '@/super-action/action/createSuperAction'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { map } from 'lodash-es'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const allowedRolesView: OrganizationRole[] = ['admin', 'member']
const allowedRolesEdit: OrganizationRole[] = ['admin']

export default ParamsWrapper(
  async ({ params }: { params: Promise<{ orgSlug: string }> }) => {
    const t = await getTranslations()

    const { orgSlug } = await params
    const { membership: myMembership } = await getMyMembershipOrNotFound({
      allowedRoles: allowedRolesView,
      orgSlug,
    })

    const isAdmin = myMembership.role === 'admin'

    const organization = await db.query.organizations.findFirst({
      where: eq(schema.organizations.slug, orgSlug),
      with: {
        inviteCodes: {
          where: isNull(schema.inviteCodes.deletedAt),
          with: {
            updatedBy: {
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
          },
          with: {
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
          orderBy: [desc(schema.organizationMemberships.createdAt)],
        },
      },
    })

    const changeRoleAction = async (data: {
      userId: string
      role: OrganizationRole
    }) => {
      'use server'
      return superAction(async () => {
        const { membership } = await getMyMembershipOrThrow({
          allowedRoles: allowedRolesEdit,
          orgSlug,
        })

        if (!organization) {
          throw new Error('Organization not found')
        }

        const currentAdmins = await db
          .select()
          .from(schema.organizationMemberships)
          .where(
            and(
              eq(schema.organizationMemberships.role, 'admin'),
              eq(
                schema.organizationMemberships.organizationId,
                organization.id,
              ),
            ),
          )

        if (
          currentAdmins.length === 1 &&
          data.role === 'member' &&
          data.userId === currentAdmins[0].userId
        ) {
          throw new Error('Cannot remove last admin')
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
              eq(
                schema.organizationMemberships.organizationId,
                organization.id,
              ),
            ),
          )

        revalidatePath(`/org/${orgSlug}/settings/members`)
      })
    }
    const kickUserAction = async (data: { userId: string }) => {
      'use server'

      return superAction(async () => {
        const myUserId = await getMyUserId()

        if (myUserId !== data.userId) {
          await getMyMembershipOrThrow({
            allowedRoles: allowedRolesEdit,
            orgSlug,
          })
        }

        if (!organization) {
          throw new Error('Organization not found')
        }

        const currentAdmins = await db
          .select()
          .from(schema.organizationMemberships)
          .where(
            and(
              eq(schema.organizationMemberships.role, 'admin'),
              eq(
                schema.organizationMemberships.organizationId,
                organization.id,
              ),
            ),
          )

        if (
          currentAdmins.length === 1 &&
          data.userId === currentAdmins[0].userId
        ) {
          throw new Error(
            'Cannot remove last admin. Please assign another admin beforehand. Otherwise you can delete the whole organization.',
          )
        }

        await db
          .delete(schema.organizationMemberships)
          .where(
            and(
              eq(schema.organizationMemberships.userId, data.userId),
              eq(
                schema.organizationMemberships.organizationId,
                organization.id,
              ),
            ),
          )

        revalidatePath(`/org/${orgSlug}/settings/members`)
        if (myUserId === data.userId) {
          redirect(`/`)
        }
      })
    }

    return (
      <>
        <TopHeader>{t.org.orgMembers}</TopHeader>
        {organization && (
          <>
            <MemberList
              organization={organization}
              changeRoleAction={changeRoleAction}
              kickUserAction={kickUserAction}
              isAdmin={isAdmin}
            />
            {isAdmin && (
              <InvitationCodesList
                {...organization}
                inviteCodes={map(organization.inviteCodes, (inviteCode) =>
                  getEnhancedInviteCode(inviteCode),
                )}
              />
            )}
          </>
        )}
      </>
    )
  },
)

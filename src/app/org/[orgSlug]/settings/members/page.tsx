import { TopHeader } from '@/components/TopHeader'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { getTranslations } from '@/i18n/getTranslations'
import { ParamsWrapper } from '@/lib/paramsServerContext'
import { superCache } from '@/lib/superCache'
import { getMyMembershipOrNotFound } from '@/organization/getMyMembership'
import { getEnhancedInviteCode } from '@/organization/inviteCodes/getInviteCode'
import { InvitationCodesList } from '@/organization/inviteCodes/InvitationCodesList'
import { MemberList } from '@/organization/MemberList'
import { OrganizationRole } from '@/organization/organizationRoles'
import { desc, eq, isNull } from 'drizzle-orm'
import { map, omit } from 'lodash-es'

const allowedRolesView: OrganizationRole[] = ['admin', 'member']

const getOrgWithInviteCodes = async ({ orgSlug }: { orgSlug: string }) => {
  'use cache'

  const org = await db.query.organizations.findFirst({
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

  if (org) {
    superCache.org({ id: org.id }).tag()
    superCache.orgMembers({ orgId: org.id }).tag()
    superCache.users().tag()
  } else {
    superCache.orgs().tag()
  }

  return org
}

export default ParamsWrapper(
  async ({ params }: { params: Promise<{ orgSlug: string }> }) => {
    const { orgSlug } = await params
    const t = await getTranslations()

    const { membership: myMembership, org } = await getMyMembershipOrNotFound({
      allowedRoles: allowedRolesView,
      orgSlug,
    })

    const isAdmin = myMembership.role === 'admin'

    const orgWithInviteCodes = await getOrgWithInviteCodes({
      orgSlug: org.slug,
    })

    const orgWithMemberships = omit(orgWithInviteCodes, ['inviteCodes'])

    return (
      <>
        <TopHeader>{t.org.orgMembers}</TopHeader>
        {orgWithInviteCodes && (
          <>
            <MemberList org={orgWithMemberships} isAdmin={isAdmin} />
            {isAdmin && (
              <InvitationCodesList
                {...org}
                inviteCodes={map(orgWithInviteCodes.inviteCodes, (inviteCode) =>
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

import { TopHeader } from '@/components/TopHeader'
import { getMyCurrentMembershipOrNotFound } from '@/organization/getMyCurrentMembership'

export default async function OrgSettingsPage({
  params,
}: {
  params: { orgSlug: string }
}) {
  await getMyCurrentMembershipOrNotFound({
    allowedRoles: ['admin'],
  })
  return <TopHeader>Organization Settings for {params.orgSlug}</TopHeader>
}

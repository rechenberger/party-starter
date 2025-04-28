import { TopHeader } from '@/components/TopHeader'
import { getMyMembershipOrNotFound } from '@/organization/getMyMembership'

export default async function OrgSettingsPage({
  params,
}: {
  params: { orgSlug: string }
}) {
  await getMyMembershipOrNotFound({
    allowedRoles: ['admin'],
  })
  return <TopHeader>Organization Settings for {params.orgSlug}</TopHeader>
}

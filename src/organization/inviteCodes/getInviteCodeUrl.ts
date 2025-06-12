import { BASE_URL } from '@/lib/config'

export const getInviteCodeUrl = ({
  organizationSlug,
  code,
}: {
  organizationSlug: string
  code: string
}) => {
  return `${BASE_URL}/join/${organizationSlug}/${code}`
}

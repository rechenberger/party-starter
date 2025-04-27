import { getMyUser } from '@/auth/getMyUser'
import { orgs } from '@/lib/starter.config'

export const canUserCreateOrg = async () => {
  const user = await getMyUser()
  return orgs.onlyAdminsCanCreateOrgs ? user?.isAdmin : !!user
}

import { getMyUser } from '@/auth/getMyUser'
import { ORGS } from '@/lib/starter.config'

export const canUserCreateOrg = async () => {
  const user = await getMyUser()
  return ORGS.onlyAdminsCanCreateOrgs ? user?.isAdmin : !!user
}

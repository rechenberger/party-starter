import { getIsLoggedIn } from '@/auth/getMyUser'
import { SIDEBAR } from '@/lib/starter.config'

export const getIsSidebarActive = async () => {
  if (typeof SIDEBAR.activeInMain === 'boolean') {
    return SIDEBAR.activeInMain
  }
  if (SIDEBAR.activeInMain === 'loggedIn') {
    return await getIsLoggedIn()
  }
  const _exhaustiveCheck: never = SIDEBAR.activeInMain
  throw new Error(`Invalid sidebar active in main config ${_exhaustiveCheck}`)
}

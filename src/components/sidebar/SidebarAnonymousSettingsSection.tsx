import { getIsLoggedIn } from '@/auth/getMyUser'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { LocaleSwitcher } from '@/i18n/LocaleSwitcher'
import { ThemeSwitcher } from '../layout/ThemeSwitcher'

export const SidebarAnonymousSettingsSection = async () => {
  const isLoggedIn = await getIsLoggedIn()
  if (isLoggedIn) return null
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarMenu>
          <LocaleSwitcher variant="sidebar" />
          <ThemeSwitcher variant="sidebar" />
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}

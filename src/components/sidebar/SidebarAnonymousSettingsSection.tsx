import { getIsLoggedIn } from '@/auth/getMyUser'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { LocaleSelect } from '@/i18n/LocaleSelect'
import { ThemeSwitcher } from '../layout/ThemeSwitcher'

export const SidebarAnonymousSettingsSection = async () => {
  const isLoggedIn = await getIsLoggedIn()
  if (isLoggedIn) return null
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarMenu>
          <LocaleSelect className="w-full" />
          <ThemeSwitcher variant="sidebar" />
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}

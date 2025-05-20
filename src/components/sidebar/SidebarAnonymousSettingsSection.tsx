import { getIsLoggedIn } from '@/auth/getMyUser'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { LocaleSelect } from '@/i18n/LocaleSelect'
import { DarkModeToggle } from '../layout/DarkModeToggle'

export const SidebarAnonymousSettingsSection = async () => {
  const isLoggedIn = await getIsLoggedIn()
  if (isLoggedIn) return null
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarMenu>
          <LocaleSelect className="w-full" />
          <DarkModeToggle variant="sidebar" />
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}

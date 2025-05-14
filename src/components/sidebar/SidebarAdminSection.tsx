import { getIsAdmin } from '@/auth/getIsAdmin'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { getNavEntries } from '../layout/MainTop'
import { SidebarNavEntry } from './SidebarNavEntry'

export const SidebarAdminSection = async () => {
  const isAdminOrDev = await getIsAdmin({ allowDev: true })
  if (!isAdminOrDev) return null
  const entries = await getNavEntries()
  const adminEntries = entries.filter((entry) => entry.adminOnly)
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        {adminEntries.map((entry) => (
          <SidebarMenuButton key={entry.href}>
            <SidebarNavEntry entry={entry} />
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

import { getIsAdmin } from '@/auth/getIsAdmin'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar'
import { getNavEntries } from '../layout/nav'
import { SidebarNavEntry } from './SidebarNavEntry'

export const SidebarAdminSection = async () => {
  const isAdminOrDev = await getIsAdmin({ allowDev: true })
  if (!isAdminOrDev) return null
  const entries = await getNavEntries({
    filter: 'admin',
  })
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        {entries.map((entry) => (
          <SidebarNavEntry entry={entry} key={entry.href} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

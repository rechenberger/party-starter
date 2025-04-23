import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-react'
import * as React from 'react'

import { getIsAdmin } from '@/auth/getIsAdmin'
import { NavAdmin } from '@/components/nav-admin'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavMain } from './nav-main'

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const isAdminOrDev = await getIsAdmin({ allowDev: true })
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>{/* <TeamSwitcher teams={data.teams} /> */}</SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        {isAdminOrDev && <NavAdmin />}
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

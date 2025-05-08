import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { SidebarLayout } from '@/components/sidebar/SidebarLayout'
import { SIDEBAR } from '@/lib/starter.config'

export default function Layout({ children }: { children: React.ReactNode }) {
  if (SIDEBAR.activeInMain) {
    return <SidebarLayout>{children}</SidebarLayout>
  }
  return <MainTopLayout>{children}</MainTopLayout>
}

import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { SidebarLayout } from '@/components/sidebar/SidebarLayout'
import { SIDEBAR } from '@/lib/starter.config'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const activeInMain = await SIDEBAR.activeInMain()
  if (activeInMain) {
    return <SidebarLayout>{children}</SidebarLayout>
  }
  return <MainTopLayout>{children}</MainTopLayout>
}

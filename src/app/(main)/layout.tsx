import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { RootLayout } from '@/components/layout/RootLayout'
import { getIsSidebarActive } from '@/components/sidebar/getIsSidebarActive'
import { SidebarLayout } from '@/components/sidebar/SidebarLayout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const activeInMain = await getIsSidebarActive()
  const content = activeInMain ? (
    <SidebarLayout>{children}</SidebarLayout>
  ) : (
    <MainTopLayout>{children}</MainTopLayout>
  )
  return <RootLayout>{content}</RootLayout>
}

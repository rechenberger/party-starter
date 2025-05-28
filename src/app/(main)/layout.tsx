import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { getIsSidebarActive } from '@/components/sidebar/getIsSidebarActive'
import { SidebarLayout } from '@/components/sidebar/SidebarLayout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const activeInMain = await getIsSidebarActive()
  return (
    <>
      {activeInMain ? (
        <SidebarLayout>{children}</SidebarLayout>
      ) : (
        <MainTopLayout>{children}</MainTopLayout>
      )}
    </>
  )
}

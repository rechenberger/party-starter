import { getIsLoggedIn } from '@/auth/getMyUser'
import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { RootLayout } from '@/components/layout/RootLayout'
import { getIsSidebarActive } from '@/components/sidebar/getIsSidebarActive'
import { SidebarLayout } from '@/components/sidebar/SidebarLayout'
import { ORGS } from '@/lib/starter.config'

export { metadata } from '@/components/layout/RootLayout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const isLoggedIn = await getIsLoggedIn()
  const activeInMain =
    isLoggedIn && ORGS.forceOrg ? true : await getIsSidebarActive()

  const content = activeInMain ? (
    <SidebarLayout>{children}</SidebarLayout>
  ) : (
    <MainTopLayout>{children}</MainTopLayout>
  )
  return <RootLayout>{content}</RootLayout>
}

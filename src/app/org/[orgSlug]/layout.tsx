import { RootLayout } from '@/components/layout/RootLayout'
import { SidebarLayout } from '@/components/sidebar/SidebarLayout'
import { ORGS } from '@/lib/starter.config'
import { redirect } from 'next/navigation'

export { metadata } from '@/components/layout/RootLayout'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orgSlug?: string }>
}) {
  if (!ORGS.isActive) {
    redirect('/')
  }

  const { orgSlug } = await params

  return (
    <RootLayout>
      <SidebarLayout routeOrgSlug={orgSlug}>{children}</SidebarLayout>
    </RootLayout>
  )
}

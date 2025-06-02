import { RootLayout } from '@/components/layout/RootLayout'
import { SidebarLayout } from '@/components/sidebar/SidebarLayout'
import { ORGS } from '@/lib/starter.config'
import { redirect } from 'next/navigation'

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
  return (
    <RootLayout>
      <SidebarLayout params={params}>{children}</SidebarLayout>
    </RootLayout>
  )
}

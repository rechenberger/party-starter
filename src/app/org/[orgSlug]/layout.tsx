import { SidebarLayout } from '@/components/sidebar/SidebarLayout'
import { ORGS } from '@/lib/starter.config'
import { redirect } from 'next/navigation'

export default function Page({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orgSlug?: string }>
}) {
  if (!ORGS.isActive) {
    redirect('/')
  }
  return <SidebarLayout params={params}>{children}</SidebarLayout>
}

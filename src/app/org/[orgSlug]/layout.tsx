import { SidebarLayout } from '@/components/SidebarLayout'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orgSlug: string }>
}) {
  return (
    <>
      <SidebarLayout params={params}>{children}</SidebarLayout>
    </>
  )
}

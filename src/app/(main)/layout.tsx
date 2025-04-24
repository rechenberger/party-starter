import { SidebarLayout } from '@/components/sidebar/SidebarLayout'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SidebarLayout>{children}</SidebarLayout>
    </>
  )
}

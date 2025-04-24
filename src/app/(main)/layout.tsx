import { SidebarLayout } from '@/components/SidebarLayout'

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

import { AppSidebar } from '@/components/app-sidebar'
import { TopHeader } from '@/components/TopHeader'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  console.log(await params)
  return (
    <>
      <SidebarProvider>
        <AppSidebar orgSlug={orgSlug} />
        <SidebarInset className="group/topheader flex flex-col gap-4 px-4">
          <TopHeader disableSeparator hideIfSecondTopHeaderExists></TopHeader>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

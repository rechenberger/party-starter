import { AppSidebar } from './app-sidebar'
import { TopHeader } from './TopHeader'
import { SidebarInset, SidebarProvider } from './ui/sidebar'

export const SidebarLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params?: Promise<{ orgSlug: string }>
}) => {
  const orgSlug = (await params)?.orgSlug
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

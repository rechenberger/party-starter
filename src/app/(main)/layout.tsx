import { AppSidebar } from '@/components/app-sidebar'
import { TopHeader } from '@/components/TopHeader'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="group/topheader flex flex-col gap-4 px-4">
          <TopHeader disableSeparator hideIfSecondTopHeaderExists></TopHeader>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

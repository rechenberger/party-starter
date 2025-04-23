import { AppSidebar } from '@/components/app-sidebar'
import { TopHeader } from '@/components/TopHeader'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopHeader disableOffset disableSeparator>
            <SidebarTrigger className="-ml-1" />
          </TopHeader>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

import { DialogProvider } from '@/super-action/dialog/DialogProvider'
import { TopHeader } from '../TopHeader'
import { SidebarInset, SidebarProvider } from '../ui/sidebar'
import { TooltipProvider } from '../ui/tooltip'
import { Sidebar } from './Sidebar'

export const SidebarLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params?: Promise<{ orgSlug?: string }>
}) => {
  const orgSlug = (await params)?.orgSlug
  return (
    <>
      <TooltipProvider>
        <SidebarProvider>
          <Sidebar orgSlug={orgSlug} />
          <SidebarInset className="group/topheader flex flex-col gap-4 px-4">
            <TopHeader disableSeparator hideIfSecondTopHeaderExists></TopHeader>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>

      <DialogProvider />
    </>
  )
}

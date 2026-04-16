import { getMyUser } from '@/auth/getMyUser'
import { canUserCreateOrg } from '@/organization/canUserCreateOrg'
import { LastUsedOrgCookieSync } from '@/organization/LastUsedOrgCookieSync'
import { resolveCurrentOrgContext } from '@/organization/resolveCurrentOrgContext'
import { DialogProvider } from '@/super-action/dialog/DialogProvider'
import { notFound } from 'next/navigation'
import { TopHeader } from '../TopHeader'
import { SidebarInset, SidebarProvider } from '../ui/sidebar'
import { Sidebar } from './Sidebar'

export const SidebarLayout = async ({
  children,
  routeOrgSlug,
}: {
  children: React.ReactNode
  routeOrgSlug?: string
}) => {
  const user = await getMyUser()
  const [orgContext, userCanCreateOrg] = await Promise.all([
    resolveCurrentOrgContext({ routeOrgSlug }),
    user ? canUserCreateOrg() : Promise.resolve(false),
  ])

  if (routeOrgSlug && !orgContext) {
    notFound()
  }

  return (
    <>
      <SidebarProvider>
        {orgContext && (
          <LastUsedOrgCookieSync activeOrgSlug={orgContext.org.slug} />
        )}
        <Sidebar orgContext={orgContext} canCreateOrg={userCanCreateOrg} />
        <SidebarInset className="group/topheader flex min-w-0 flex-col gap-4 px-4">
          <TopHeader disableSeparator hideIfSecondTopHeaderExists></TopHeader>
          {children}
        </SidebarInset>
      </SidebarProvider>

      <DialogProvider />
    </>
  )
}

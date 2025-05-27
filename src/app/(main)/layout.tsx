import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { getIsSidebarActive } from '@/components/sidebar/getIsSidebarActive'
import { SidebarLayout } from '@/components/sidebar/SidebarLayout'
import { ParamsWrapper } from '@/lib/paramsServerContext'

export default ParamsWrapper(
  async ({ children }: { children: React.ReactNode }) => {
    const activeInMain = await getIsSidebarActive()
    if (activeInMain) {
      return (
        <>
          <SidebarLayout>{children}</SidebarLayout>
        </>
      )
    }
    return (
      <>
        <MainTopLayout>{children}</MainTopLayout>
      </>
    )
  },
)

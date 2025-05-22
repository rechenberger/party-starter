import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { SidebarLayout } from '@/components/sidebar/SidebarLayout'
import { ParamsWrapper } from '@/lib/paramsServerContext'
import { SIDEBAR } from '@/lib/starter.config'

export default ParamsWrapper(
  async ({ children }: { children: React.ReactNode }) => {
    const activeInMain = await SIDEBAR.activeInMain()
    if (activeInMain) {
      return <SidebarLayout>{children}</SidebarLayout>
    }
    return <MainTopLayout>{children}</MainTopLayout>
  },
)

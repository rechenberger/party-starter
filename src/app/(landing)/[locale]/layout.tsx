import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { ParamsWrapper } from '@/lib/paramsServerContext'

export default ParamsWrapper(
  async ({ children }: { children: React.ReactNode }) => {
    return <MainTopLayout>{children}</MainTopLayout>
  },
)

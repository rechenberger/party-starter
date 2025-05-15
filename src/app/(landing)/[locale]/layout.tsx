import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { LOCALES } from '@/i18n/locale'
import { ParamsWrapper } from '@/lib/paramsServerContext'

export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({
    locale,
  }))
}

export default ParamsWrapper(
  async ({ children }: { children: React.ReactNode }) => {
    return <MainTopLayout>{children}</MainTopLayout>
  },
)

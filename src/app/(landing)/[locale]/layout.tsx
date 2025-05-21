import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { generateMetadataLocalizedLayout } from '@/i18n/generateMetadataLocalized'
import { LOCALES } from '@/i18n/locale'
import { ParamsWrapper } from '@/lib/paramsServerContext'

export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({
    locale,
  }))
}

export const dynamicParams = false // Not found if not locale

export const generateMetadata = generateMetadataLocalizedLayout()

export default ParamsWrapper(
  async ({ children }: { children: React.ReactNode }) => {
    return <MainTopLayout>{children}</MainTopLayout>
  },
)

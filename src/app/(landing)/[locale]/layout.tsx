import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { RootLayout } from '@/components/layout/RootLayout'
import { generateMetadataLocalizedLayout } from '@/i18n/generateMetadataLocalized'
import { LOCALES, Locale } from '@/i18n/locale'

export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({
    locale,
  }))
}

export const dynamicParams = false // Not found if not locale

export const generateMetadata = generateMetadataLocalizedLayout()

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const locale = Locale.parse((await params).locale)

  return (
    <RootLayout locale={locale}>
      <MainTopLayout locale={locale}>{children}</MainTopLayout>
    </RootLayout>
  )
}

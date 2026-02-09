import { StartPage } from '@/components/StartPage'
import { generateMetadataLocalized } from '@/i18n/generateMetadataLocalized'
import { Locale } from '@/i18n/locale'

export const generateMetadata = generateMetadataLocalized()

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = Locale.parse((await params).locale)
  return <StartPage locale={locale} />
}

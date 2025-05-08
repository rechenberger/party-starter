import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { getMyLocale } from '@/i18n/getMyLocale'
import { LOCALIZATION } from '@/lib/starter.config'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  if (LOCALIZATION.isActive) {
    const locale = await getMyLocale()
    redirect(`/${locale}`)
  }
  return <MainTopLayout>{children}</MainTopLayout>
}

import { getMyLocale } from '@/i18n/getMyLocale'
import { redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ locale?: string }>
}) {
  const locale = await getMyLocale({ params })
  redirect(`/${locale}`)
}

import { getMyLocale } from '@/i18n/getMyLocale'
import { redirect } from 'next/navigation'

export const GET = async () => {
  const locale = await getMyLocale()
  redirect(`/${locale}`)
}

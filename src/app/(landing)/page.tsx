import { getMyLocale } from '@/i18n/getMyLocale'
import { ParamsWrapper } from '@/lib/paramsServerContext'
import { redirect } from 'next/navigation'

export default ParamsWrapper(async () => {
  const locale = await getMyLocale()
  redirect(`/${locale}`)
})

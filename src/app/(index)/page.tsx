import { StartPage } from '@/components/StartPage'
import { getMyLocale } from '@/i18n/getMyLocale'
import { ParamsWrapper } from '@/lib/paramsServerContext'
import { LOCALIZATION } from '@/lib/starter.config'
import { redirect } from 'next/navigation'

export default ParamsWrapper(async () => {
  return <StartPage />
})

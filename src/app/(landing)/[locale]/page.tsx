import { StartPage } from '@/components/StartPage'
import { generateMetadataLocalized } from '@/i18n/generateMetadataLocalized'
import { ParamsWrapper } from '@/lib/paramsServerContext'

export const generateMetadata = generateMetadataLocalized()

export default ParamsWrapper(async () => {
  return <StartPage />
})

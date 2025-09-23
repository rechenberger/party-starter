import { StartPage } from '@/components/StartPage'
import { generateMetadataLocalized } from '@/i18n/generateMetadataLocalized'

export const generateMetadata = generateMetadataLocalized()

export default async function Page() {
  return <StartPage />
}

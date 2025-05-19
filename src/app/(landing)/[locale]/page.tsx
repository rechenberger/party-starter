import { StartPage } from '@/components/StartPage'
import { LOCALES } from '@/i18n/locale'

export default async function Page() {
  return <StartPage />
}

export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({
    locale,
  }))
}

export const dynamicParams = false // Not found if not locale

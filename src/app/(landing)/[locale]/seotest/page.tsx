import { generateMetadataLocalized } from '@/i18n/generateMetadataLocalized'
import { getTranslations } from '@/i18n/getTranslations'

export const generateMetadata = generateMetadataLocalized(
  async ({ locale }) => {
    return {
      title: locale === 'de' ? 'SEO Testung' : 'SEO Test',
    }
  },
)

export default async function Page() {
  const t = await getTranslations()
  return <div>{t.welcome.title}</div>
}

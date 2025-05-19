import { getTranslations } from '@/i18n/getTranslations'
import { generateMetadataLocalized } from '../../generateLocaleAlternates'

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

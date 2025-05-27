import { BRAND } from '@/lib/starter.config'
import { t as emailTranslationsEn } from './emailTranslations.en'

export const t = {
  welcome: (orgName: string) => (
    <>
      Tritt <strong>{orgName}</strong> auf <BRAND.TextLogo /> bei
    </>
  ),
} satisfies typeof emailTranslationsEn

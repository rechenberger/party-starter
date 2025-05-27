import { BRAND } from '@/lib/starter.config'

export const t = {
  welcome: (orgName: string) => (
    <>
      Join <strong>{orgName}</strong> on <BRAND.TextLogo />
    </>
  ),
}

export type EmailTranslations = typeof t

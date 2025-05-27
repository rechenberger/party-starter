import { t as emailTranslationsEn } from './emailTranslations.en'

export const t = {
  welcome: (orgName: string) => `Willkommen bei ${orgName}`,
} satisfies typeof emailTranslationsEn

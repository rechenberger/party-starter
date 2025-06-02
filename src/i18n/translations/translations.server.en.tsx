import { mergeDeep } from 'remeda'
import { t as email } from './emailTranslations.en'
import { t as clientT } from './translations.en'

const serverT = {
  email,
}

export type TranslationsServerOnly = typeof serverT

export const t = mergeDeep(serverT, clientT)
export type TranslationsServerAndClient = typeof t

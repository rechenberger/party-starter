import { mergeDeep } from 'remeda'
import { t as email } from './emailTranslations.de'
import { t as clientT } from './translations.de'
import type { TranslationsServerOnly } from './translations.server.en'

const serverT = {
  email,
} satisfies TranslationsServerOnly

export const t = mergeDeep(serverT, clientT)

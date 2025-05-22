import 'server-only'

import { mergeDeep } from 'remeda'
import { t as clientT } from './translations.de'
import type { TranslationsServerOnly } from './translations.server.en'

const serverT = {} satisfies TranslationsServerOnly

export const t = mergeDeep(serverT, clientT)

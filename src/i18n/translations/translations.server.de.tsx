import 'server-only'

import { mergeDeep } from 'remeda'
import { t as clientT } from './translations.de'
import type { serverT as enServerT } from './translations.server.en'

const serverT = {} satisfies enServerT

export const t = mergeDeep(serverT, clientT)

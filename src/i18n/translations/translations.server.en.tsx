import 'server-only'

import { mergeDeep } from 'remeda'
import { t as clientT } from './translations.en'

const serverT = {}

export type serverT = typeof serverT

export const t = mergeDeep(serverT, clientT)

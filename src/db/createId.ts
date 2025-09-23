import { customAlphabet } from 'nanoid'

export const nanoid = customAlphabet('123456789abcdefghijkmnopqrstuvwxyz')

export const createId = () => nanoid(16)

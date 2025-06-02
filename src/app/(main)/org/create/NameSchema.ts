import { z } from 'zod'

export const NameSchema = z
  .string()
  .trim()
  .min(1)
  .refine((name) => name.toLowerCase() !== 'create', {
    params: {
      i18n: {
        key: 'org.createOrg.name.refine',
      },
    },
  })

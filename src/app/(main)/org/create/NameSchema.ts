import { z } from 'zod'

export const NameSchema = z
  .string()
  .trim()
  .min(1, 'Organization name is required')
  .refine((name) => name.toLowerCase() !== 'create', 'Name cannot be "create"')

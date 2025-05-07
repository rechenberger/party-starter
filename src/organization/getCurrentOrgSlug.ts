import { paramsContext } from '@/lib/paramsServerContext'
import { z } from 'zod'

export const getCurrentOrgSlug = async () => {
  const paramsFromContext = paramsContext.get()
  if (!paramsFromContext) {
    console.error('No params found in context')
    console.error('Did you forget to wrap your page in ParamsWrapper?')
    return null
  }
  const params = await paramsFromContext
  const orgSlug = z.string().nullish().parse(params.orgSlug)
  return orgSlug
}

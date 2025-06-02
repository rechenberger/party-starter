import { unstable_rootParams } from 'next/server'
import { z } from 'zod'

export const getCurrentOrgSlug = async () => {
  const params: unknown = await unstable_rootParams()
  if (!params) {
    console.error('No params found in context')
    console.error('Did you forget to wrap your page in ParamsWrapper?')
    return null
  }
  const { orgSlug } = z
    .object({
      orgSlug: z.string().nullish(),
    })
    .parse(params)
  return orgSlug
}

import { unstable_rootParams } from 'next/server'
import { z } from 'zod'

export const getCurrentOrgSlug = async () => {
  const params: unknown = await unstable_rootParams()

  const { orgSlug } = z
    .object({
      orgSlug: z.string().nullish(),
    })
    .parse(params)
  return orgSlug
}

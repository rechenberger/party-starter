import { unstable_rootParams } from 'next/server'
import { z } from 'zod'

export const getCurrentOrgSlug = async () => {
  const params = await unstable_rootParams()
  const orgSlug = z.string().nullish().parse(params.orgSlug)
  return orgSlug
}

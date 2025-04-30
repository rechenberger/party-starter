import { unstable_rootParams } from 'next/server'
import { z } from 'zod'

export const getCurrentOrgSlug = async () => {
  const params = await unstable_rootParams()
  const orgSlug = z
    .string()
    .nullish()
    //TODO: FIX THIS ANY
    .parse((params as any).orgSlug)
  return orgSlug
}

import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { getCurrentOrgSlug } from './getCurrentOrgSlug'

export const getCurrentOrg = async () => {
  const orgSlug = await getCurrentOrgSlug()
  if (!orgSlug) {
    notFound()
  }
  const org = await db.query.organizations.findFirst({
    where: eq(schema.organizations.slug, orgSlug),
  })
  if (!org) {
    notFound()
  }
  return org
}

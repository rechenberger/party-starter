import { getMyUser } from '@/auth/getMyUser'
import { getMyLocale } from '@/i18n/getMyLocale'
import { ORGS } from '@/lib/starter.config'
import { resolveCurrentOrgContext } from '@/organization/resolveCurrentOrgContext'
import { redirect } from 'next/navigation'

export const GET = async () => {
  const user = await getMyUser()

  if (user && ORGS.forceOrg) {
    const orgContext = await resolveCurrentOrgContext()
    if (!orgContext) {
      throw new Error('Active organization context is required for /.')
    }
    redirect(`/org/${orgContext.org.slug}`)
  }

  if (user) {
    redirect('/app')
  }

  const locale = await getMyLocale()
  redirect(`/${locale}`)
}

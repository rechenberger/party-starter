import { getMyUserOrLogin } from '@/auth/getMyUser'
import { TopHeader } from '@/components/TopHeader'
import { getTranslations } from '@/i18n/getTranslations'
import { ORGS } from '@/lib/starter.config'
import { resolveCurrentOrgContext } from '@/organization/resolveCurrentOrgContext'
import { redirect } from 'next/navigation'

export default async function Page() {
  await getMyUserOrLogin({
    forceRedirectUrl: '/app',
  })

  if (ORGS.forceOrg) {
    const orgContext = await resolveCurrentOrgContext()
    if (!orgContext) {
      throw new Error('Active organization context is required for /app.')
    }
    redirect(`/org/${orgContext.org.slug}`)
  }

  const t = await getTranslations()
  return (
    <>
      <TopHeader>Dashboard</TopHeader>
      <div>{t.app.welcome}</div>
    </>
  )
}

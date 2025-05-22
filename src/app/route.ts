import { getIsLoggedIn } from '@/auth/getMyUser'
import { getMyLocale } from '@/i18n/getMyLocale'
import { redirect } from 'next/navigation'

export const GET = async () => {
  const isLoggedIn = await getIsLoggedIn()

  // TODO: redirect to latest org?

  // Redirect to dashboard
  if (isLoggedIn) {
    redirect('/app')
  }

  // Redirect to landing page
  const locale = await getMyLocale()
  redirect(`/${locale}`)
}

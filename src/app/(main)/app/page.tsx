import { getMyUserOrLogin } from '@/auth/getMyUser'
import { TopHeader } from '@/components/TopHeader'
import { getTranslations } from '@/i18n/getTranslations'

export default async function Page() {
  await getMyUserOrLogin({
    forceRedirectUrl: '/app',
  })
  const t = await getTranslations()
  return (
    <>
      <TopHeader>Dashboard</TopHeader>
      <div>{t.app.welcome}</div>
    </>
  )
}

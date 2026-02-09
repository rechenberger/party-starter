import { UserButtonSuspense } from '@/auth/UserButton'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { LocaleSwitcher } from '@/i18n/LocaleSwitcher'
import { Locale } from '@/i18n/locale'
import { Suspense } from 'react'
import { ThemeSwitcher } from './ThemeSwitcher'

const Fallback = () => {
  return (
    <>
      <LocaleSwitcher />
      <ThemeSwitcher />
    </>
  )
}

const UserSettings = async ({ locale }: { locale?: Locale }) => {
  const isLoggedIn = await getIsLoggedIn()
  if (isLoggedIn) {
    return (
      <>
        <UserButtonSuspense locale={locale} />
      </>
    )
  }
  return <Fallback />
}

export const MainTopUserSettings = ({ locale }: { locale?: Locale }) => {
  return (
    <Suspense fallback={<Fallback />}>
      <UserSettings locale={locale} />
    </Suspense>
  )
}

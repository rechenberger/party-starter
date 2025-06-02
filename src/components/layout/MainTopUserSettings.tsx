import { UserButtonSuspense } from '@/auth/UserButton'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { LocaleSwitcher } from '@/i18n/LocaleSwitcher'
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

const UserSettings = async () => {
  const isLoggedIn = await getIsLoggedIn()
  if (isLoggedIn) {
    return (
      <>
        <UserButtonSuspense />
      </>
    )
  }
  return <Fallback />
}

export const MainTopUserSettings = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <UserSettings />
    </Suspense>
  )
}

import { UserButtonSuspense } from '@/auth/UserButton'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { LocaleSwitcher } from '@/i18n/LocaleSwitcher'
import { Suspense } from 'react'
import { ThemeSwitcher } from './ThemeSwitcher'

const UserStuffFallback = () => {
  return (
    <>
      <LocaleSwitcher />
      <ThemeSwitcher />
    </>
  )
}

const UserStuff = async () => {
  const isLoggedIn = await getIsLoggedIn()
  if (isLoggedIn) {
    return (
      <>
        <UserButtonSuspense />
      </>
    )
  }
  return <UserStuffFallback />
}

export const MainTopUserSettings = () => {
  return (
    <Suspense fallback={<UserStuffFallback />}>
      <UserStuff />
    </Suspense>
  )
}

import { UserButtonSuspense } from '@/auth/UserButton'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { LocaleSelect } from '@/i18n/LocaleSelect'
import { Suspense } from 'react'
import { DarkModeToggle } from './DarkModeToggle'

const UserStuffFallback = () => {
  return (
    <>
      <DarkModeToggle />
      <LocaleSelect />
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

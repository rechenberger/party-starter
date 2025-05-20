import { getMyUserOrLogin } from '@/auth/getMyUser'
import { TopHeader } from '@/components/TopHeader'

export default async function Page() {
  await getMyUserOrLogin({
    forceRedirectUrl: '/app',
  })
  return (
    <>
      <TopHeader>Dashboard</TopHeader>
      <div>Welcome to the app</div>
    </>
  )
}

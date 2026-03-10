import { ChangePasswordForm } from '@/auth/ChangePasswordForm'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { loginWithRedirect } from '@/auth/loginWithRedirect'
import { Card, CardContent } from '@/components/ui/card'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; token?: string }>
}) {
  const { redirect, token } = await searchParams

  const isLoggedIn = await getIsLoggedIn()
  if (!isLoggedIn && !token) {
    await loginWithRedirect()
  }

  const redirectUrl = redirect && decodeURIComponent(redirect)

  return (
    <>
      <div className="flex-1" />
      <Card className="self-center w-full max-w-md flex flex-col gap-4">
        <CardContent className="flex flex-col gap-4 pt-6">
          <ChangePasswordForm redirectUrl={redirectUrl} token={token} />
        </CardContent>
      </Card>
      <div className="flex-1" />
    </>
  )
}

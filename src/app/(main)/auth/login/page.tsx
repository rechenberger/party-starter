import { LoginForm } from '@/auth/LoginForm'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { redirect } from 'next/navigation'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect: redirectRaw } = await searchParams

  const redirectUrl = redirectRaw && decodeURIComponent(redirectRaw)
  const isLoggedIn = await getIsLoggedIn()
  if (isLoggedIn) {
    redirect(redirectUrl ?? '/')
  }

  return (
    <>
      <LoginForm redirectUrl={redirectUrl} />
    </>
  )
}

import { LoginForm } from '@/auth/LoginForm'
import { getIsLoggedIn } from '@/auth/getMyUser'
import { Card } from '@/components/ui/card'
import { getMyLocale } from '@/i18n/getMyLocale'
import { ParamsWrapper } from '@/lib/paramsServerContext'
import { redirect } from 'next/navigation'

export default ParamsWrapper(
  async ({
    searchParams,
  }: {
    searchParams: Promise<{ redirect?: string }>
  }) => {
    const { redirect: redirectRaw } = await searchParams
    const locale = await getMyLocale()
    const redirectUrl = redirectRaw && decodeURIComponent(redirectRaw)
    const isLoggedIn = await getIsLoggedIn()
    if (isLoggedIn) {
      redirect(redirectUrl ?? `/${locale}`)
    }

    return (
      <>
        <Card className="self-center w-full max-w-md flex flex-col gap-4">
          <LoginForm redirectUrl={redirectUrl} />
        </Card>
      </>
    )
  },
)

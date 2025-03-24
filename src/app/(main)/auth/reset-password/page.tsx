import { ChangePasswordForm } from '@/auth/ChangePasswordForm'
import { Card, CardContent } from '@/components/ui/card'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Reset Password',
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; token?: string }>
}) {
  const { redirect, token } = await searchParams

  // we have to base64 decode because better-auth cannot handle encoded urls
  const redirectUrl = redirect && atob(redirect)

  if (!token) {
    notFound()
  }

  return (
    <>
      <Card className="self-center w-full max-w-md flex flex-col gap-4">
        <CardContent className="flex flex-col gap-4 pt-6">
          <ChangePasswordForm
            redirectUrl={redirectUrl}
            variant="reset"
            token={token}
          />
        </CardContent>
      </Card>
    </>
  )
}

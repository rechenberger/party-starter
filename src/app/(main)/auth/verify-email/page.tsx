'use client'

import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home = ({
  searchParams: { redirect: redirectUrl },
}: {
  searchParams: { redirect: string }
}) => {
  const router = useRouter()
  useEffect(() => {
    if (redirectUrl) {
      router.replace(redirectUrl)
    }
  }, [redirectUrl, router])

  return (
    <Card className="self-center w-full max-w-md flex flex-col gap-4">
      <CardTitle>Verifying Email</CardTitle>
      <CardDescription>Redirecting...</CardDescription>
    </Card>
  )
}

export default Home

'use client'

import { ErrorPage } from '@/components/ErrorPage'

export default function Page({ error }: { error: Error }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <ErrorPage error={error} />
    </div>
  )
}

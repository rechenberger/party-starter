'use client'

import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { convexClient } from '@convex-dev/better-auth/client/plugins'
import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { ConvexProvider } from 'convex/react'
import { useState } from 'react'
import { createBrowserConvexClient } from '@/lib/convex-client'

const authBaseUrl =
  typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL?.trim() ??
      process.env.SITE_URL?.trim() ??
      process.env.BASE_URL?.trim() ??
      'http://localhost:3000')

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
  plugins: [convexClient(), adminClient()],
})

export const AppAuthProviders = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [client] = useState(() => createBrowserConvexClient())

  return (
    <ConvexProvider client={client}>
      <ConvexBetterAuthProvider client={client} authClient={authClient}>
        {children}
      </ConvexBetterAuthProvider>
    </ConvexProvider>
  )
}

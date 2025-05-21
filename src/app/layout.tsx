import { isDev } from '@/auth/dev'
import { Toaster } from '@/components/ui/toaster'
import { BASE_URL } from '@/lib/config'
import { BRAND } from '@/lib/starter.config'
import { ActionCommandProvider } from '@/super-action/command/ActionCommandProvider'
import { DialogProvider } from '@/super-action/dialog/DialogProvider'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import '../app/globals.css'

const titlePrefix = isDev() ? '[DEV] ' : ''

export const metadata: Metadata = {
  title: {
    default: `${titlePrefix}${BRAND.name}`,
    template: `${titlePrefix}%s | ${BRAND.name}`,
  },
  description: BRAND.metadata.description,

  metadataBase: new URL(BASE_URL),
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<unknown>
}) {
  await params
  // console.log({ params: await params })

  return (
    <html suppressHydrationWarning>
      <body className="bg-background min-h-[100svh] flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>{children}</SessionProvider>
          <ActionCommandProvider />
          <Toaster />
          <DialogProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}

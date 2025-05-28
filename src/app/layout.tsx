import { isDev } from '@/auth/dev'
import { Toaster } from '@/components/ui/toaster'
import { LocaleProvider } from '@/i18n/LocaleContext'
import { getMyLocale } from '@/i18n/getMyLocale'
import { BASE_URL } from '@/lib/config'
import { BRAND } from '@/lib/starter.config'
import { ActionCommandProvider } from '@/super-action/command/ActionCommandProvider'
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
  // params,
}: {
  children: React.ReactNode
  // params: Promise<unknown>
}) {
  // await params // Need to await params here, otherwise ParamsWrapper does not work in dev (turbopack)
  const locale = await getMyLocale()
  return (
    <html suppressHydrationWarning>
      <body className="bg-background min-h-[100svh] flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <LocaleProvider value={locale}>{children}</LocaleProvider>
          </SessionProvider>
          <ActionCommandProvider />
          <Toaster />
          {/* <DialogProvider /> This has to be inside deeper layouts in order to receive the current locale from ParamsWrapper */}
        </ThemeProvider>
      </body>
    </html>
  )
}

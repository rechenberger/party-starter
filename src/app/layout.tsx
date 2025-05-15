import { isDev } from '@/auth/dev'
import { Toaster } from '@/components/ui/toaster'
import { getMyLocale } from '@/i18n/getMyLocale'
import { DEFAULT_LOCALE } from '@/i18n/locale'
import { BASE_URL } from '@/lib/config'
import { ParamsWrapper } from '@/lib/paramsServerContext'
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

export default ParamsWrapper(
  async ({ children }: { children: React.ReactNode }) => {
    const locale = await getMyLocale()
    return (
      <html lang={locale ?? DEFAULT_LOCALE} suppressHydrationWarning>
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
  },
)

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
import '../../app/globals.css'

const titlePrefix = isDev() ? '[DEV] ' : ''

export const metadata: Metadata = {
  title: {
    default: `${titlePrefix}${BRAND.name}`,
    template: `${titlePrefix}%s | ${BRAND.name}`,
  },
  description: BRAND.metadata.description,
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: BRAND.logoUrl,
    shortcut: BRAND.logoUrl,
  },
}

export async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getMyLocale()
  return (
    <html suppressHydrationWarning lang={locale}>
      <body className="bg-background min-h-[100svh] flex flex-col">
        <style>
          {`
          :root {
            --primary: ${BRAND.colors.primary};
            --primary-foreground: ${BRAND.colors.primaryForeground};
          }
          
          .dark {
            --primary: ${BRAND.colors.primary};
            --primary-foreground: ${BRAND.colors.primaryForeground};
          }
        `}
        </style>
        <LocaleProvider value={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider>{children}</SessionProvider>
            <ActionCommandProvider />
            <Toaster />
            {/* <DialogProvider /> This has to be inside deeper layouts in order to receive the current locale from ParamsWrapper */}
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}

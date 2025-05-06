import { isDev } from '@/auth/dev'
import { Toaster } from '@/components/ui/toaster'
import { LocaleProvider } from '@/i18n/LocaleContext'
import { getMyLocale } from '@/i18n/getMyLocale'
import { ActionCommandProvider } from '@/super-action/command/ActionCommandProvider'
import { DialogProvider } from '@/super-action/dialog/DialogProvider'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import '../app/globals.css'

const titlePrefix = isDev() ? '[DEV] ' : ''

export const metadata: Metadata = {
  title: {
    default: `${titlePrefix}Party Starter`,
    template: `${titlePrefix}%s | Party Starter`,
  },
  description: 'by Tristan Rechenberger',
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale?: string }>
}) {
  const locale = await getMyLocale({ params })
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background min-h-[100svh] flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocaleProvider value={locale}>
            {children}
            <ActionCommandProvider />
            <Toaster />
            <DialogProvider />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

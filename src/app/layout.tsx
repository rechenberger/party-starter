import { isDev } from '@/auth/dev'
import { Toaster } from '@/components/ui/toaster'
import { ActionCommandProvider } from '@/super-action/command/ActionCommandProvider'
import { DialogProvider } from '@/super-action/dialog/DialogProvider'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const titlePrefix = isDev() ? '[DEV] ' : ''

export const metadata: Metadata = {
  title: {
    default: `${titlePrefix}Party Starter`,
    template: `${titlePrefix}%s | Party Starter`,
  },
  description: 'by Tristan Rechenberger',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background min-h-[100svh] flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <ActionCommandProvider />
          <Toaster />
          <DialogProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}

import { isDev } from '@/auth/dev'
import { Toaster } from '@/components/ui/toaster'
import { ParamsWrapper } from '@/lib/paramsServerContext'
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

export default ParamsWrapper(
  async ({ children }: { children: React.ReactNode }) => {
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
  },
)

import { DialogProvider } from '@/super-action/dialog/DialogProvider'
import { Locale } from '@/i18n/locale'
import { MainTop } from './MainTop'

export const MainTopLayout = ({
  children,
  locale,
}: {
  children: React.ReactNode
  locale?: Locale
}) => {
  return (
    <>
      <MainTop locale={locale} />
      <div className="container flex flex-col gap-8 py-8 flex-1">
        {children}
      </div>

      <DialogProvider />
    </>
  )
}

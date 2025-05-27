import { DialogProvider } from '@/super-action/dialog/DialogProvider'
import { MainTop } from './MainTop'

export const MainTopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MainTop />
      <div className="container flex flex-col gap-8 py-8 flex-1">
        {children}
      </div>

      <DialogProvider />
    </>
  )
}

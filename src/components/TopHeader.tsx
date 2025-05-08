import { SIDEBAR } from '@/lib/starter.config'
import { cn } from '@/lib/utils'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'

export const TopHeader = ({
  children,
  disableSeparator = false,
  hideIfSecondTopHeaderExists = false,
}: {
  children?: React.ReactNode
  disableOffset?: boolean
  disableSeparator?: boolean
  hideIfSecondTopHeaderExists?: boolean
}) => {
  if (!SIDEBAR.activeInMain) {
    return children
  }

  return (
    <div
      className={cn(
        'topheader',
        'flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
        hideIfSecondTopHeaderExists &&
          'group-has-[.topheader:nth-of-type(2)]/topheader:hidden',
      )}
    >
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger className="-ml-1" />
        {!disableSeparator && (
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
        )}
        {children}
      </div>
    </div>
  )
  // return <div className="-mt-10 ml-12">{children}</div>
}

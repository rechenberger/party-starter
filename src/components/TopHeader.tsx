import { cn } from '@/lib/utils'
import { Separator } from './ui/separator'

export const TopHeader = ({
  children,
  disableOffset: disableOffset = false,
  disableSeparator = false,
}: {
  children: React.ReactNode
  disableOffset?: boolean
  disableSeparator?: boolean
}) => {
  return (
    <div
      className={cn(
        'flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
        !disableOffset &&
          '-mt-16 ml-8 group-has-data-[collapsible=icon]/sidebar-wrapper:-mt-12',
      )}
    >
      <div className="flex items-center gap-4 px-4">
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

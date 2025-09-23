import { isDev, isLocalDb } from '@/auth/dev'
import { cn } from '@/lib/utils'

export const DevBadges = ({ className }: { className?: string }) => {
  return (
    <>
      <div className={cn('flex flex-row gap-1', className)}>
        {isLocalDb() && (
          <div className="text-sm bg-red-500/50 rounded-md px-2 py-1">
            Local DB
          </div>
        )}
        {isDev() && (
          <div className="text-sm bg-red-500/50 rounded-md px-2 py-1">DEV</div>
        )}
      </div>
    </>
  )
}

import { cn } from '@/lib/utils'
import { Slot as SlotPrimitive } from '@radix-ui/react-slot'
import { ArrowRight, Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

export const SuperLoadingIcon = ({
  icon = <ArrowRight />,
  isLoading = false,
  className,
}: {
  icon?: ReactNode
  isLoading?: boolean
  className?: string
}) => {
  const Icon = isLoading ? <Loader2 /> : icon
  return (
    <SlotPrimitive
      className={cn('size-4', isLoading && 'animate-spin', className)}
    >
      {Icon}
    </SlotPrimitive>
  )
}

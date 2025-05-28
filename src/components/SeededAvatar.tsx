'use client'

import { cn } from '@/lib/utils'
import Avatar from 'boring-avatars'
export default function SeededAvatar(
  props: React.ComponentProps<typeof Avatar> & {
    value: string
    variant?: string
    className?: string
  },
) {
  return (
    <div className={cn('dark:invert dark:hue-rotate-180', props.className)}>
      <Avatar name={props.value} {...props} />
    </div>
  )
}

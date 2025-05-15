'use client'

import { cn } from '@/lib/utils'
import Avvvatars from 'avvvatars-react'
export default function SeededAvatar(
  props: React.ComponentProps<typeof Avvvatars> & { className?: string },
) {
  return (
    <div className={cn('dark:invert dark:hue-rotate-180', props.className)}>
      <Avvvatars {...props} style={props.style ?? 'shape'} />
    </div>
  )
}

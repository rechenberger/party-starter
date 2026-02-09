'use client'

import { cn } from '@/lib/utils'
import Avatar from 'boring-avatars'
import type { ComponentProps } from 'react'

type AvatarProps = ComponentProps<typeof Avatar>

export const SimpleSeededAvatar = (
  props: Omit<AvatarProps, 'name'> & {
    value: string
  },
) => {
  return (
    <div className={cn('dark:invert dark:hue-rotate-180', props.className)}>
      <Avatar name={props.value} {...props} />
    </div>
  )
}

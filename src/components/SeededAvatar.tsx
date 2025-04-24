'use client'

import Avvvatars from 'avvvatars-react'

export default function SeededAvatar(
  props: React.ComponentProps<typeof Avvvatars>,
) {
  return (
    <div className="dark:invert dark:hue-rotate-180">
      <Avvvatars {...props} style={props.style ?? 'shape'} />
    </div>
  )
}

'use client'

import { ActionButton } from '@/super-action/button/ActionButton'
import { partyAction } from './party-action'

export const PartyButton = () => {
  return (
    <>
      {/* ActionButton can handle streaming from superActions: */}
      <ActionButton
        command={{
          // inject this action into the CMD+K menu
          // label: 'Stream Party!', // optional, defaults to children
          shortcut: {
            key: 'p', // Also set a keyboard-shortcut
          },
        }}
        action={partyAction}
      >
        Party!
      </ActionButton>
    </>
  )
}

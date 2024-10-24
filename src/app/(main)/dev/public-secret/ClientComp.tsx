'use client'

import { SimpleDataCard } from '@/components/simple/SimpleDataCard'
import { ActionButton } from '@/super-action/button/ActionButton'
import { useState } from 'react'
import { PublicSuperState } from './createSuperState'

export const ClientComp = ({
  superState: initialSuperState,
}: {
  superState: PublicSuperState<any>
}) => {
  const [superState, setSuperState] = useState(initialSuperState)

  return (
    <>
      <SimpleDataCard data={superState} />
      <ActionButton
        action={async () => {
          const newSuperState = await superState.editPublicState({
            name: superState.publicState.name + '!',
          })
          setSuperState(newSuperState)
        }}
      >
        {superState.publicState.name}
      </ActionButton>
    </>
  )
}

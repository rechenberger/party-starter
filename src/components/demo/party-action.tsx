'use server'

import {
  streamDialog,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ClientComp } from './ClientComp'
import { Readme } from './Readme'

export const partyAction = async () => {
  return superAction(async () => {
    streamDialog({
      title: 'Test',
      content: (
        <>
          <ClientComp />
        </>
      ),
    })
  })
}

export const SuperServerComp = async ({
  className,
}: {
  className?: string
}) => {
  return (
    <>
      <div className={className}>
        <Readme />
      </div>
    </>
  )
}

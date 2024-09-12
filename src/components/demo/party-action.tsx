'use server'

import {
  streamDialog,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ClientComp } from './ClientComp'

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

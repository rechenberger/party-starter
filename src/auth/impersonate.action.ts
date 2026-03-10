'use server'

import { superAction } from '@/super-action/action/createSuperAction'
import { headers } from 'next/headers'
import { auth } from './auth'
import { throwIfNotAdmin } from './getIsAdmin'

export const impersonateAction = async ({ userId }: { userId: string }) => {
  return superAction(async () => {
    await throwIfNotAdmin({ allowDev: true })
    await auth.api.impersonateUser({
      body: { userId },
      headers: await headers(),
    })
  })
}

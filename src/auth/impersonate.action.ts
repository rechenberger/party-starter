'use server'

import { superAction } from '@/super-action/action/createSuperAction'
import { streamRevalidatePath } from '@/super-action/action/streamRevalidatePath'
import { signIn } from './auth'
import { throwIfNotAdmin } from './getIsAdmin'

export const impersonateAction = async ({ userId }: { userId: string }) => {
  return superAction(async () => {
    await throwIfNotAdmin({ allowDev: true })
    await signIn('impersonate', {
      userId,
      secret: process.env.AUTH_SECRET!,
      redirect: false,
    })
    streamRevalidatePath('/', 'layout')
  })
}

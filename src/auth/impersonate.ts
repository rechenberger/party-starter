import { streamRevalidatePath } from '@/super-action/action/streamRevalidatePath'
import { signIn } from './auth'
import { throwIfNotAdmin } from './getIsAdmin'

export const impersonate = async ({ userId }: { userId: string }) => {
  await throwIfNotAdmin({ allowDev: true })
  const res = await signIn('impersonate', {
    userId,
    secret: process.env.AUTH_SECRET!,
    redirect: false,
  })
  streamRevalidatePath('/', 'layout')
  return res
}

import { headers } from 'next/headers'
import { auth } from './auth'

export const changePassword = async ({
  userId,
  password,
}: {
  userId: string
  password: string
}) => {
  // TODO: does not work when user already has a password
  await auth.api.setPassword({
    body: {
      newPassword: password,
    },
    headers: await headers(),
  })
}

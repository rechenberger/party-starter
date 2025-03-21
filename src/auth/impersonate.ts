import { auth } from './auth'

export const impersonate = async ({ userId }: { userId: string }) => {
  // await signIn('impersonate', {
  //   userId,
  //   secret: process.env.AUTH_SECRET!,
  //   redirect: false,
  // })

  try {
    await auth.api.loginAsUser({
      body: {
        userId,
      },
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

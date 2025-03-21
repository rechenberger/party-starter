'use client'

import { ActionButton } from '@/super-action/button/ActionButton'
import { signIn } from './betterAuthClient'

export const LoginSocial = () => {
  return (
    <>
      <ActionButton
        variant={'outline'}
        action={async () => {
          await signIn.social({
            provider: 'discord',
          })
        }}
      >
        Continue with Discord
      </ActionButton>
    </>
  )
}

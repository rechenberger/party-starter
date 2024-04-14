import { ActionButton } from '@/super-action/button/ActionButton'
import { CredentialsForm } from './CredentialsForm'
import { signIn } from './auth'

export const LoginDialog = () => {
  return (
    <>
      <CredentialsForm
        onSubmit={async (credentials) => {
          'use server'
          await signIn('credentials', credentials)
        }}
      />
      <div className="flex flex-row items-center">
        <hr className="flex-1" />
        <span className="mx-4 text-border">or</span>
        <hr className="flex-1" />
      </div>
      <ActionButton
        variant={'outline'}
        action={async () => {
          'use server'
          await signIn('discord')
        }}
      >
        Sign in with Discord
      </ActionButton>
    </>
  )
}

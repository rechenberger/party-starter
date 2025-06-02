import { LoginFormClient } from '@/auth/LoginFormClient'
import { registerUser } from '@/auth/registerUser'
import { getTranslations } from '@/i18n/getTranslations'
import {
  streamDialog,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'

export const CreateUserButton = async () => {
  const t = await getTranslations()
  return (
    <>
      <ActionButton
        size="sm"
        action={async () => {
          'use server'
          return superAction(async () => {
            streamDialog({
              title: t.userManagement.createUser.title,
              content: (
                <>
                  <LoginFormClient
                    action={async (credentials) => {
                      'use server'
                      return superAction(async () => {
                        if (credentials.type === 'forgotPassword') {
                          throw new Error('Invalid type')
                        }
                        await registerUser(credentials)
                        streamDialog(null)
                      })
                    }}
                  />
                </>
              ),
            })
          })
        }}
      >
        {t.userManagement.createUser.create}
      </ActionButton>
    </>
  )
}

import {
  streamCommands,
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'

export const CommandsButton = () => {
  return (
    <>
      <ActionButton
        variant={'outline'}
        command={{
          shortcut: {
            key: 'c',
          },
        }}
        action={async () => {
          'use server'

          return superAction(async () => {
            streamCommands({
              commands: [
                {
                  label: 'one',
                  action: async () => {
                    'use server'
                    return superAction(async () => {
                      streamToast({
                        title: 'ONE!',
                      })
                    })
                  },
                },
              ],
            })
          })
        }}
      >
        Command!
      </ActionButton>
    </>
  )
}

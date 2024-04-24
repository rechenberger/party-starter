import { useSetAtom } from 'jotai'
import { Fragment, useCallback, useState } from 'react'
import { SuperActionCommands } from '../action/createSuperAction'
import { useSuperAction } from '../action/useSuperAction'
import { ActionCommandDialog } from '../command/ActionCommandDialog'
import { ActionCommandItem } from '../command/ActionCommandItem'
import { dialogRenderAtom } from './DialogProvider'

export const useShowCommandDialog = () => {
  const setRender = useSetAtom(dialogRenderAtom)
  return useCallback(
    (commands: SuperActionCommands) => {
      const newRender = <CommandDialog commands={commands.commands} />
      setRender(newRender)
    },
    [setRender],
  )
}

const CommandDialog = ({
  commands,
}: {
  commands: SuperActionCommands['commands']
}) => {
  const [open, setOpen] = useState(true)
  const setRender = useSetAtom(dialogRenderAtom)

  return (
    <ActionCommandDialog
      open={open}
      setOpen={(o) => {
        setOpen(o)
        if (!o) {
          setRender(null)
        }
      }}
    >
      {commands.map((command, id) => (
        <Fragment key={id}>
          <CommandDialogItem
            command={command}
            onDone={() => {
              setOpen(false)
              setRender(null)
            }}
          />
        </Fragment>
      ))}
    </ActionCommandDialog>
  )
}

const CommandDialogItem = ({
  command,
  onDone,
}: {
  command: SuperActionCommands['commands'][number]
  onDone: () => void
}) => {
  const { trigger, isLoading } = useSuperAction({
    action: command.action,
  })
  return (
    <ActionCommandItem
      disabled={isLoading}
      command={{
        children: command.label,
        action: async () => {
          await trigger()
          onDone()
        },
      }}
    ></ActionCommandItem>
  )
}

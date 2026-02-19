'use client'

import { Switch } from '@/components/ui/switch'
import { useTranslations } from '@/i18n/useTranslations'
import { ActionWrapper } from '@/super-action/button/ActionWrapper'
import { toggleUserAdminAction } from './toggleUserAdmin.action'

export const AdminToggleSwitch = ({
  userId,
  userEmail,
  userDisplay,
  isAdmin,
}: {
  userId: string
  userEmail: string
  userDisplay: string
  isAdmin: boolean
}) => {
  const t = useTranslations()

  const confirmationTitle = isAdmin
    ? t.users.removeAdmin(userDisplay)
    : t.users.makeAdmin(userDisplay)

  const commandLabel = isAdmin
    ? t.users.removeAdmin(userEmail)
    : t.users.makeAdmin(userEmail)

  return (
    <ActionWrapper
      askForConfirmation={{
        title: confirmationTitle,
      }}
      action={async () => {
        await toggleUserAdminAction({
          userId,
          nextIsAdmin: !isAdmin,
          email: userEmail,
        })
      }}
      command={{
        label: commandLabel,
      }}
    >
      <Switch checked={isAdmin} />
    </ActionWrapper>
  )
}

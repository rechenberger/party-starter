import { getMyUser } from './getMyUser'
import { ChangeUsernameFormClient } from './ChangeUsernameFormClient'

export const ChangeUsernameForm = async ({
  redirectUrl,
}: {
  redirectUrl?: string
}) => {
  const user = await getMyUser()
  return (
    <ChangeUsernameFormClient
      username={user?.name ?? undefined}
      redirectUrl={redirectUrl}
    />
  )
}

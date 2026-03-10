import { getMyUser } from './getMyUser'
import { ChangePasswordFormClient } from './ChangePasswordFormClient'

export const ChangePasswordForm = async ({
  redirectUrl,
}: {
  redirectUrl?: string
}) => {
  const user = await getMyUser()
  return (
    <ChangePasswordFormClient email={user?.email} redirectUrl={redirectUrl} />
  )
}

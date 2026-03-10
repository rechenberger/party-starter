import { Button } from '@/components/ui/button'
import { getTranslations } from '@/i18n/getTranslations'

export const CreateUserButton = async () => {
  const t = await getTranslations()
  return (
    <Button
      size="sm"
      type="button"
      disabled
      title="Pending Better Auth admin wiring"
    >
      {t.userManagement.createUser.create}
    </Button>
  )
}

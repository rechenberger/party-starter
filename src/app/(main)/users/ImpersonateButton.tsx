'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n/useTranslations'
import { SuperActionWithInput } from '@/super-action/action/createSuperAction'
import { useSuperAction } from '@/super-action/action/useSuperAction'
import { SuperLoadingIcon } from '@/super-action/button/SuperLoadingIcon'
import { Check, VenetianMask } from 'lucide-react'
import { useSession } from 'next-auth/react'

export const ImpersonateButton = ({
  userId,
  action,
}: {
  userId: string
  action: SuperActionWithInput<{ userId: string }>
}) => {
  const { data: session, update } = useSession()
  const isCurrentUser = session?.user?.id === userId
  const t = useTranslations()
  const { trigger, isLoading } = useSuperAction({
    action,
    catchToast: true,
  })
  return (
    <>
      <Button
        size="sm"
        variant={'outline'}
        className="flex-1"
        disabled={isCurrentUser}
        onClick={async () => {
          if (isCurrentUser) return

          await trigger({ userId })
          update()
        }}
      >
        {isCurrentUser
          ? t.userManagement.currentUser
          : t.userManagement.loginAs}
        <SuperLoadingIcon
          icon={isCurrentUser ? <Check /> : <VenetianMask />}
          isLoading={isLoading}
        />
      </Button>
    </>
  )
}

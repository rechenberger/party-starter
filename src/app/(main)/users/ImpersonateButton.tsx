'use client'

import { impersonateAction } from '@/auth/impersonate.action'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n/useTranslations'
import { useSuperAction } from '@/super-action/action/useSuperAction'
import { SuperLoadingIcon } from '@/super-action/button/SuperLoadingIcon'
import { Check, VenetianMask } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const ImpersonateButton = ({ userId }: { userId: string }) => {
  const { data: session, update } = useSession()
  const router = useRouter()
  const isCurrentUser = session?.user?.id === userId
  const t = useTranslations()
  const { trigger, isLoading } = useSuperAction({
    action: impersonateAction,
    catchToast: true,
  })
  return (
    <>
      <Button
        data-testid={`impersonate-button-${userId}`}
        size="sm"
        variant={'outline'}
        className="flex-1"
        disabled={isCurrentUser}
        onClick={async () => {
          if (isCurrentUser) return

          await trigger({ userId })
          update() // Force update session
          router.refresh() // Force Reload page and layout
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

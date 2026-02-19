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
  const buttonLabel = isCurrentUser
    ? t.userManagement.currentUser
    : t.userManagement.loginAs
  const { trigger, isLoading } = useSuperAction({
    action: impersonateAction,
    catchToast: true,
  })
  return (
    <>
      <Button
        data-testid={`impersonate-button-${userId}`}
        size="icon-sm"
        variant={'outline'}
        title={buttonLabel}
        aria-label={buttonLabel}
        disabled={isCurrentUser}
        onClick={async () => {
          if (isCurrentUser) return

          await trigger({ userId })
          update() // Force update session
          router.refresh() // Force Reload page and layout
        }}
      >
        <span className="sr-only">{buttonLabel}</span>
        <SuperLoadingIcon
          icon={isCurrentUser ? <Check /> : <VenetianMask />}
          isLoading={isLoading}
        />
      </Button>
    </>
  )
}

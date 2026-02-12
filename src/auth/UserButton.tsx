import { UserAvatar } from '@/components/UserAvatar'
import { UserMenuDropDownContent } from '@/components/UserMenuDropDownContent'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { ActionButton } from '@/super-action/button/ActionButton'
import { getTranslations } from '@/i18n/getTranslations'
import { Locale } from '@/i18n/locale'
import { ChevronDown, ChevronsUpDown, LogInIcon } from 'lucide-react'
import { Suspense } from 'react'
import { getMyUser } from './getMyUser'
import { loginWithRedirect } from './loginWithRedirect'

export const UserButtonSuspense = ({
  large,
  locale,
}: {
  large?: boolean
  locale?: Locale
}) => {
  return (
    <Suspense fallback={<Skeleton className="w-[38px] h-8" />}>
      <UserButton large={large} locale={locale} />
    </Suspense>
  )
}

export const UserButton = async ({
  large,
  locale,
}: {
  large?: boolean
  locale?: Locale
}) => {
  const user = await getMyUser()
  const t = await getTranslations({ locale })
  const showName = false

  if (!!user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger
            nativeButton
            render={
              <Button size="vanilla" variant="vanilla">
                {showName ? (
                  <>
                    <span>
                      {user.name ?? user.email ?? t.standardWords.you}
                    </span>
                    <ChevronDown className="size-4" />
                  </>
                ) : (
                  <>
                    <UserAvatar user={user} />
                    {large && (
                      <>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {user.name}
                          </span>
                          <span className="truncate text-xs">{user.email}</span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                      </>
                    )}
                  </>
                )}
              </Button>
            }
          />
          <DropdownMenuContent side="bottom" align="end">
            <UserMenuDropDownContent user={user} locale={locale} />
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  }

  return (
    <>
      <ActionButton
        size="sm"
        variant={'outline'}
        hideIcon
        action={loginWithRedirect}
      >
        <span className="hidden md:block">{t.auth.loginAction}</span>
        <LogInIcon className="size-4" />
      </ActionButton>
    </>
  )
}

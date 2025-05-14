import { SimpleUserAvatar } from '@/components/simple/SimpleUserAvatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { UserMenuDropDownContent } from '@/components/UserMenuDropDownContent'
import { ActionButton } from '@/super-action/button/ActionButton'
import { ChevronDown } from 'lucide-react'
import { Suspense } from 'react'
import { getMyUser } from './getMyUser'
import { loginWithRedirect } from './loginWithRedirect'

export const UserButtonSuspense = () => {
  return (
    <Suspense fallback={<Skeleton className="w-[38px] h-8" />}>
      <UserButton />
    </Suspense>
  )
}

export const UserButton = async () => {
  const user = await getMyUser()

  const showName = false

  if (!!user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="vanilla" size="icon">
              {showName ? (
                <>
                  <span>{user.name ?? user.email ?? 'You'}</span>
                  <ChevronDown className="size-4" />
                </>
              ) : (
                <>
                  <SimpleUserAvatar user={user} />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <UserMenuDropDownContent user={user} />
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
        Login
      </ActionButton>
    </>
  )
}

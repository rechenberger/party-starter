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
import { ChevronDown, ChevronsUpDown, LogInIcon } from 'lucide-react'
import { Suspense } from 'react'
import { getMyUser } from './getMyUser'
import { loginWithRedirect } from './loginWithRedirect'

export const UserButtonSuspense = ({ large }: { large?: boolean }) => {
  return (
    <Suspense fallback={<Skeleton className="w-[38px] h-8" />}>
      <UserButton large={large} />
    </Suspense>
  )
}

export const UserButton = async ({ large }: { large?: boolean }) => {
  const user = await getMyUser()
  const showName = false

  if (!!user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="vanilla" variant="vanilla">
              {showName ? (
                <>
                  <span>{user.name ?? user.email ?? 'You'}</span>
                  <ChevronDown className="size-4" />
                </>
              ) : (
                <>
                  <SimpleUserAvatar user={user} />
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
        action={async () => {
          'use server'
          await loginWithRedirect()
        }}
      >
        <span className="hidden md:block">Login</span>
        <LogInIcon className="size-4" />
      </ActionButton>
    </>
  )
}

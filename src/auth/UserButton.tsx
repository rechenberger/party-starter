import { SimpleDataCard } from '@/components/simple/SimpleDataCard'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ActionButton } from '@/super-action/button/ActionButton'
import { ChevronDown, KeyRound, LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'
import { signOut } from './auth'
import { getMySession } from './getMyUser'
import {
  changePasswordWithRedirect,
  loginWithRedirect,
} from './loginWithRedirect'

export const UserButton = async () => {
  const session = await getMySession()

  if (!!session?.user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <span>{session.user?.name ?? session.user?.email ?? 'You'}</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <SimpleDataCard
                data={session.user}
                classNameCell="max-w-40 overflow-hidden text-ellipsis"
              />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <ActionButton
                variant={'ghost'}
                hideIcon
                className="w-full text-left"
                size={'sm'}
                action={changePasswordWithRedirect}
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Change Password
              </ActionButton>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <ActionButton
                variant={'ghost'}
                hideIcon
                className="w-full text-left"
                size={'sm'}
                action={async () => {
                  'use server'
                  const signOutResponse = await signOut({ redirect: false })
                  const url = signOutResponse.redirect
                  const response = await fetch(url)
                  if (response.ok) {
                    redirect(url)
                  } else {
                    redirect('/')
                  }
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </ActionButton>
            </DropdownMenuItem>
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

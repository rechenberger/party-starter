import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { getMyLocale } from '@/i18n/getMyLocale'
import { ActionButton } from '@/super-action/button/ActionButton'
import { ChevronDown, KeyRound, LogOut, User } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { auth, signOut } from './auth'
import {
  changePasswordWithRedirect,
  loginWithRedirect,
} from './loginWithRedirect'

export const UserButtonSuspense = async () => {
  return (
    <Suspense fallback={<Skeleton className="w-[38px] h-8" />}>
      <UserButton />
    </Suspense>
  )
}

export const UserButton = async () => {
  const session = await auth()
  const locale = await getMyLocale()
  const showName = false

  if (!!session?.user) {
    const email = session.user.email
    const name = session.user.name ?? email
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {showName ? (
                <>
                  <span>
                    {session.user?.name ?? session.user?.email ?? 'You'}
                  </span>
                  <ChevronDown className="size-4" />
                </>
              ) : (
                <>
                  <User className="size-4" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuLabel>
              <div className="text-xs text-muted-foreground">Logged in as</div>
              <div>{name}</div>
              {email !== name && (
                <div className="text-xs text-muted-foreground">{email}</div>
              )}
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
                    redirect(`/${locale}`)
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
        action={async () => {
          'use server'
          await loginWithRedirect({ locale })
        }}
      >
        Login
      </ActionButton>
    </>
  )
}

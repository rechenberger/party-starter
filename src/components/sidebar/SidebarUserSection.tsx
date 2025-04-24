import {
  ChevronsUpDown,
  KeyRound,
  LogIn,
  LogOut,
  UserRound,
} from 'lucide-react'

import { signOut } from '@/auth/auth'
import { getMyUser } from '@/auth/getMyUser'
import {
  changePasswordWithRedirect,
  changeUsernameWithRedirect,
  loginWithRedirect,
} from '@/auth/loginWithRedirect'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ActionButton } from '@/super-action/button/ActionButton'
import { redirect } from 'next/navigation'
import { ResponsiveDropdownMenuContent } from '../ResponsiveDropdownMenuContent'

export const SidebarUserSection = async () => {
  const user = await getMyUser()

  if (!user) {
    return (
      <>
        <ActionButton
          size="sm"
          variant={'outline'}
          hideIcon
          action={loginWithRedirect}
        >
          <LogIn className="size-4" />
          <span className="group-data-[collapsible=icon]:hidden">Login</span>
        </ActionButton>
      </>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name ?? ''}
                />
                <AvatarFallback className="rounded-lg">
                  {user.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <ResponsiveDropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.image ?? undefined}
                    alt={user.name ?? ''}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <ActionButton
                  variant={'ghost'}
                  hideIcon
                  className="w-full text-left flex justify-start"
                  size={'sm'}
                  action={changeUsernameWithRedirect}
                >
                  <UserRound className="size-4" />
                  Change Username
                </ActionButton>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <ActionButton
                  variant={'ghost'}
                  hideIcon
                  className="w-full text-left flex justify-start"
                  size={'sm'}
                  action={changePasswordWithRedirect}
                >
                  <KeyRound className="size-4" />
                  Change Password
                </ActionButton>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <ActionButton
                variant={'ghost'}
                hideIcon
                className="w-full text-left flex justify-start"
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
                <LogOut className="size-4" />
                Logout
              </ActionButton>
            </DropdownMenuItem>
          </ResponsiveDropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

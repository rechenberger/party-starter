import { ChevronsUpDown, LogIn } from 'lucide-react'

import { getMyUser } from '@/auth/getMyUser'
import { loginWithRedirect } from '@/auth/loginWithRedirect'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ActionButton } from '@/super-action/button/ActionButton'
import { ResponsiveDropdownMenuContent } from '../ResponsiveDropdownMenuContent'
import { SimpleUserAvatar } from '../simple/SimpleUserAvatar'
import { UserMenuDropDownContent } from '../UserMenuDropDownContent'

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
              <SimpleUserAvatar user={user} />
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
            <UserMenuDropDownContent user={user} />
          </ResponsiveDropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

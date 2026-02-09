import { House, KeyRound, LogOut, UserRound } from 'lucide-react'

import { signOut } from '@/auth/auth'
import {
  changePasswordWithRedirect,
  changeUsernameWithRedirect,
} from '@/auth/loginWithRedirect'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { User } from '@/db/schema-zod'
import { LocaleSwitcher } from '@/i18n/LocaleSwitcher'
import { getMyLocale } from '@/i18n/getMyLocale'
import { getTranslations } from '@/i18n/getTranslations'
import { Locale } from '@/i18n/locale'
import { LOCALIZATION } from '@/lib/starter.config'
import { cn } from '@/lib/utils'
import { ActionButton } from '@/super-action/button/ActionButton'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { UserAvatar } from './UserAvatar'
import { ThemeSwitcher } from './layout/ThemeSwitcher'

export const UserMenuDropDownContent = async ({
  user,
  locale,
}: {
  user: Pick<User, 'name' | 'email' | 'image'>
  locale?: Locale
}) => {
  if (!user) {
    return null
  }
  const t = await getTranslations({ locale })
  const currentLocale = await getMyLocale({ paramsLocale: locale })
  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserAvatar user={user} />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span
              className={cn(
                'truncate',
                !!user.name ? 'text-xs font-light' : 'font-medium',
              )}
            >
              {user.email}
            </span>
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
            {t.userManagement.changeUsernameAction}
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
            {t.userManagement.changePasswordAction}
          </ActionButton>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <LocaleSwitcher variant="submenu" />
      <ThemeSwitcher variant="submenu" />
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href={LOCALIZATION.isActive ? `/${currentLocale}` : '/'}>
          <House className="size-4" />
          {t.standardWords.homepage}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <ActionButton
          variant={'ghost'}
          hideIcon
          className="w-full text-left flex justify-start"
          size={'sm'}
          action={async () => {
            'use server'
            const signOutResponse = await signOut({ redirect: false })
            // This only works if we dont have any loading.tsx (because sites always return status code 200 when loading):
            // const url = signOutResponse.redirect
            // const response = await fetch(url)
            // if (response.ok) {
            //   redirect(url)
            // } else {
            //   redirect('/')
            // }
            redirect('/')
          }}
        >
          <LogOut className="size-4" />
          {t.standardWords.logout}
        </ActionButton>
      </DropdownMenuItem>
    </>
  )
}

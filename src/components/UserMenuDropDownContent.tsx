import { Check, Globe, House, KeyRound, LogOut, UserRound } from 'lucide-react'

import { signOut } from '@/auth/auth'
import {
  changePasswordWithRedirect,
  changeUsernameWithRedirect,
} from '@/auth/loginWithRedirect'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@/db/schema-zod'
import { LocaleSelectButton } from '@/i18n/LocaleSelect'
import { getMyLocale } from '@/i18n/getMyLocale'
import { localeDefinitions } from '@/i18n/locale'
import { LOCALIZATION } from '@/lib/starter.config'
import { cn } from '@/lib/utils'
import { ActionButton } from '@/super-action/button/ActionButton'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SimpleUserAvatar } from './simple/SimpleUserAvatar'

export const UserMenuDropDownContent = async ({
  user,
}: {
  user: Pick<User, 'name' | 'email' | 'image'>
}) => {
  if (!user) {
    return null
  }
  const currentLocale = await getMyLocale()
  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <SimpleUserAvatar user={user} />
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
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Globe className="size-4" />
          <span>Change Language</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {localeDefinitions.map((locale) => {
              const isCurrentLocale = locale.locale === currentLocale
              return (
                <DropdownMenuItem
                  key={locale.locale}
                  disabled={isCurrentLocale}
                >
                  <LocaleSelectButton locale={locale} />
                  {isCurrentLocale && <Check className="size-4" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href={LOCALIZATION.isActive ? `/${currentLocale}` : '/'}>
          <House className="size-4" />
          Homepage
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
    </>
  )
}

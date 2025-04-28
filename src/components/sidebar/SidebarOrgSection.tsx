import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { getMyMembershipOrNotFound } from '@/organization/getMyMembership'
import { Building2, Laugh } from 'lucide-react'
import Link from 'next/link'

export const SidebarOrgSection = async ({ orgSlug }: { orgSlug: string }) => {
  const membership = await getMyMembershipOrNotFound()

  const items = [
    {
      title: 'Say Hello',
      url: `/org/${orgSlug}?say=hello`,
      icon: Laugh,
    },
  ]

  const settings = [
    {
      title: 'Organization',
      url: `/org/${orgSlug}/settings`,
      icon: Building2,
      show: membership?.role === 'admin',
    },
  ]

  const settingsToShow = settings.filter((setting) => setting.show)

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Org Stuff for {orgSlug}</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuButton key={item.title} tooltip={item.title} asChild>
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      {settingsToShow.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            {settingsToShow.map((setting) => (
              <SidebarMenuButton key={setting.title} asChild>
                <Link href={setting.url}>
                  {setting.icon && <setting.icon />}
                  <span>{setting.title}</span>
                </Link>
              </SidebarMenuButton>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}
    </>
  )
}

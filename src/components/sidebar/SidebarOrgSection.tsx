'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Laugh } from 'lucide-react'
import Link from 'next/link'

export const SidebarOrgSection = async ({ orgSlug }: { orgSlug: string }) => {
  const items = [
    {
      title: 'Say Hello',
      url: `/org/${orgSlug}?say=hello`,
      icon: Laugh,
    },
  ]

  return (
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
  )
}

'use client'

import { useEffect } from 'react'
import { serializeLastUsedOrgCookie } from './lastUsedOrgCookie'

export const LastUsedOrgCookieSync = ({
  activeOrgSlug,
}: {
  activeOrgSlug: string
}) => {
  useEffect(() => {
    document.cookie = serializeLastUsedOrgCookie(activeOrgSlug)
  }, [activeOrgSlug])

  return null
}

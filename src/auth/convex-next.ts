import { convexBetterAuthNextJs } from '@convex-dev/better-auth/nextjs'
import { api } from '../../convex/_generated/api'
import { convexUrl } from '@/lib/convex-url'

const convexSiteUrl =
  process.env.CONVEX_SITE_URL?.trim() ??
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL?.trim() ??
  'http://127.0.0.1:3211'

export const convexNext = convexBetterAuthNextJs({
  convexUrl,
  convexSiteUrl,
})

export const convexApi = api

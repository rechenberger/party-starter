import { convexBetterAuthNextJs } from '@convex-dev/better-auth/nextjs'
import { api } from '../../convex/_generated/api'
import { convexUrl } from '@/lib/convex'

export const convexNext = convexBetterAuthNextJs({
  convexUrl,
  convexSiteUrl: process.env.CONVEX_SITE_URL ?? '',
})

export const convexApi = api

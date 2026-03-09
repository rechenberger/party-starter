import { ConvexHttpClient } from 'convex/browser'
import { ConvexReactClient } from 'convex/react'

const getConvexUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_CONVEX_URL?.trim() ?? process.env.CONVEX_URL?.trim()

  if (!url) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL or CONVEX_URL must be set')
  }

  return url
}

export const convexUrl = getConvexUrl()

export const createBrowserConvexClient = () => new ConvexReactClient(convexUrl)

export const createServerConvexClient = () => new ConvexHttpClient(convexUrl)

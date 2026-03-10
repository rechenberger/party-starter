import { ConvexHttpClient } from 'convex/browser'
import { convexUrl } from './convex-url'

export const createServerConvexClient = () => new ConvexHttpClient(convexUrl)

'use client'

import { ConvexReactClient } from 'convex/react'
import { convexUrl } from './convex-url'

export const createBrowserConvexClient = () => new ConvexReactClient(convexUrl)

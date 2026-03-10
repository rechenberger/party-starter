import { getAuthConfigProvider } from '@convex-dev/better-auth/auth-config'
import type { AuthConfig } from 'convex/server'

const authConfig = {
  providers: [getAuthConfigProvider()],
} satisfies AuthConfig

export default authConfig

import { defineConfig } from '@playwright/test'
import { baseConfig, baseURL } from './playwright.base'

export default defineConfig({
  ...baseConfig,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: {
    command:
      'E2E_MODE=dev EMAIL_FROM=e2e@example.com SMTP_URL=smtp://e2e:e2e@127.0.0.1:2525 pnpm dev:e2e',
    url: `${baseURL}/api/auth/session`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})

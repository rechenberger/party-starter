import { defineConfig } from '@playwright/test'
import path from 'node:path'
import { baseConfig } from './playwright.base'

const runId = process.env.E2E_RUN_ID ?? 'local'

const artifactsDir =
  process.env.E2E_ARTIFACTS_DIR ??
  path.resolve(process.cwd(), '.e2e-artifacts', runId)

export default defineConfig({
  ...baseConfig,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    [
      'html',
      {
        open: 'never',
        outputFolder: path.join(artifactsDir, 'playwright-report'),
      },
    ],
  ],
  outputDir: path.join(artifactsDir, 'test-results'),
  use: {
    ...baseConfig.use,
    video: 'retain-on-failure',
  },
})

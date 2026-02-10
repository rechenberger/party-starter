import { defineConfig, devices } from '@playwright/test'
import os from 'node:os'

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3000'
const workers = Number(process.env.E2E_WORKERS)
const resolvedWorkers =
  Number.isInteger(workers) && workers > 0
    ? workers
    : Math.max(1, os.cpus().length)

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: resolvedWorkers,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: {
    command: 'pnpm dev:e2e',
    url: `${baseURL}/api/auth/session`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
})

import { devices, type PlaywrightTestConfig } from '@playwright/test'
import os from 'node:os'

const maxWorkers = 6
const workers = Number(process.env.E2E_WORKERS)

export const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3000'

export const resolvedWorkers =
  Number.isInteger(workers) && workers > 0
    ? workers
    : Math.max(1, Math.min(os.cpus().length, maxWorkers))

export const baseConfig = {
  testDir: './e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: resolvedWorkers,
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
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
} satisfies PlaywrightTestConfig

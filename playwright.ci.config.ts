import { defineConfig, devices } from '@playwright/test'
import os from 'node:os'
import path from 'node:path'

const runId = process.env.E2E_RUN_ID ?? 'local'
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3000'
const workers = Number(process.env.E2E_WORKERS)
const resolvedWorkers =
  Number.isInteger(workers) && workers > 0
    ? workers
    : Math.max(1, os.cpus().length)

const artifactsDir =
  process.env.E2E_ARTIFACTS_DIR ??
  path.resolve(process.cwd(), '.e2e-artifacts', runId)

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: resolvedWorkers,
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
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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
})

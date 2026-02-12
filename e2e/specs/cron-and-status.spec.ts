import { expect, test } from '@playwright/test'
import { loginWithCredentials } from '../support/auth'
import { getPartitionForWorker } from '../support/seed-manifest'

test('cron pages and status endpoint are covered', async ({
  page,
  request,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const owner = partition.users.owner

  await loginWithCredentials({
    page,
    email: owner.email,
    password: owner.password,
  })

  await page.goto('/cron')
  await expect(page.getByText(/^test$/i).first()).toBeVisible()
  await expect(
    page.getByRole('link', { name: /view runs/i }).first(),
  ).toBeVisible()

  await page.goto('/cron/Test')
  await expect(page).toHaveURL(/\/cron\/Test/)
  await expect(page.getByText(/cron runs/i).first()).toBeVisible()

  const statusResponse = await request.get('/api/status')
  expect(statusResponse.status()).toBe(200)
  const statusBody = (await statusResponse.json()) as {
    success: boolean
    checks: Array<{ name: string; success: boolean }>
  }
  expect(statusBody.success).toBe(true)
  expect(statusBody.checks.length).toBeGreaterThan(0)
})

test('cron api route enforces authorization and can run with valid secret', async ({
  request,
}) => {
  const cronSecret = process.env.CRON_SECRET?.trim()

  const unauthorizedResponse = await request.get('/api/cron/test')
  if (cronSecret) {
    expect(unauthorizedResponse.status()).toBe(401)

    const authorizedResponse = await request.get('/api/cron/test', {
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
    })
    expect(authorizedResponse.status()).toBe(200)
    const body = await authorizedResponse.text()
    expect(body).toContain('OK')
    return
  }

  expect(unauthorizedResponse.status()).toBeGreaterThanOrEqual(500)
})

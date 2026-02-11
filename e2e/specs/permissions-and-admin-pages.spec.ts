import { expect, test, type Page } from '@playwright/test'
import { loginWithCredentials } from '../support/auth'
import { getPartitionForWorker } from '../support/seed-manifest'

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3000'

test.describe.configure({ mode: 'serial' })

const expectNotFoundPage = async (page: Page) => {
  await expect
    .poll(
      async () => {
        const customNotFoundVisible = await page
          .getByText(/page not found/i)
          .first()
          .isVisible()
          .catch(() => false)
        if (customNotFoundVisible) {
          return true
        }

        const defaultNotFoundVisible = await page
          .getByRole('heading', { name: '404' })
          .isVisible()
          .catch(() => false)
        if (defaultNotFoundVisible) {
          return true
        }

        const defaultMessageVisible = await page
          .getByText(/could not be found/i)
          .first()
          .isVisible()
          .catch(() => false)
        return defaultMessageVisible
      },
      { timeout: 12_000 },
    )
    .toBe(true)
}

test('admin can create a user and toggle admin role on users page', async ({
  page,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const owner = partition.users.owner
  const email = `e2e-users-create-${partition.index}-${Date.now()}@example.com`
  const password = `CreateUserPass!${partition.index}`

  await loginWithCredentials({
    page,
    email: owner.email,
    password: owner.password,
  })

  await page.goto('/users')
  const main = page.getByRole('main').first()

  await page.getByRole('button', { name: /^create user$/i }).first().click()
  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()

  await expect
    .poll(
      async () => {
        await page.reload()
        return main
          .locator('[data-testid^="user-card-"]')
          .filter({ hasText: email })
          .count()
      },
      { timeout: 20_000 },
    )
    .toBe(1)

  const createdUserCard = main
    .locator('[data-testid^="user-card-"]')
    .filter({ hasText: email })
    .first()
  const adminSwitch = createdUserCard.locator('[data-slot="switch"]').first()

  await expect(adminSwitch).toHaveAttribute('data-state', 'unchecked')
  await adminSwitch.click()
  await page.getByTestId('dialog-confirm').first().click()

  await expect
    .poll(
      async () => {
        await page.reload()
        return (
          (await createdUserCard
            .locator('[data-slot="switch"]')
            .first()
            .getAttribute('data-state')) ?? ''
        )
      },
      { timeout: 20_000 },
    )
    .toBe('checked')
})

test('permission guards enforce org admin access and mode-aware admin pages', async ({
  page,
  browser,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const member = partition.users.member
  const candidate = partition.users.candidate
  const membersOrgSlug = partition.orgs.members
  const mode = process.env.E2E_MODE ?? 'dev'

  await loginWithCredentials({
    page,
    email: member.email,
    password: member.password,
  })

  await page.goto(`/org/${membersOrgSlug}/settings`)
  await expectNotFoundPage(page)

  await page.goto('/users')
  if (mode === 'ci') {
    await expectNotFoundPage(page)
  } else {
    await expect(page).toHaveURL(/\/users/)
    await expect(page.getByText(/^users$/i).first()).toBeVisible()
  }

  await page.goto('/cron')
  if (mode === 'ci') {
    await expectNotFoundPage(page)
  } else {
    await expect(page).toHaveURL(/\/cron/)
    await expect(page.getByText(/cron jobs/i).first()).toBeVisible()
  }

  if (mode === 'ci') {
    await page.goto('/cron/Test')
    await expectNotFoundPage(page)
  } else {
    await page.goto('/cron/Test')
    await expect(page).toHaveURL(/\/cron\/Test/)
    await expect(page.getByText(/cron runs/i).first()).toBeVisible()
  }

  const candidateContext = await browser.newContext({ baseURL })
  const candidatePage = await candidateContext.newPage()

  await loginWithCredentials({
    page: candidatePage,
    email: candidate.email,
    password: candidate.password,
  })
  await candidatePage.goto(`/org/${membersOrgSlug}/settings/members`)
  await expectNotFoundPage(candidatePage)

  await candidateContext.close()
})

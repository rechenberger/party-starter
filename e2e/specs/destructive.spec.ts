import { expect, test } from '@playwright/test'
import { loginWithCredentials } from '../support/auth'
import { getPartitionForWorker } from '../support/seed-manifest'

test.describe.configure({ mode: 'serial' })

test('destructive flows: delete org and delete user', async ({
  page,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const owner = partition.users.owner
  const deleteTarget = partition.users.deleteTarget

  await loginWithCredentials({
    page,
    email: owner.email,
    password: owner.password,
  })

  const orgSlug = `e2e-delete-org-${partition.index}-${Date.now()}`

  await page.goto('/org/create')
  await page.getByTestId('create-org-name').fill(orgSlug)
  await page.getByTestId('create-org-submit').click()
  await expect(page).toHaveURL(new RegExp(`/org/${orgSlug}`))

  await page.goto(`/org/${orgSlug}/settings`)
  await page
    .getByRole('main')
    .first()
    .locator('[data-testid="delete-org-button"]:visible')
    .first()
    .click()
  await page.getByTestId('dialog-confirm').first().click()
  await expect(page).not.toHaveURL(new RegExp(`/org/${orgSlug}/settings`))

  await page.goto('/users')
  const main = page.getByRole('main').first()
  await page.getByTestId('users-search-input').fill(deleteTarget.email)
  await page.getByTestId('users-search-submit').click()
  await expect(
    main.getByTestId(`user-row-${deleteTarget.id}`).first(),
  ).toBeVisible()
  await main.getByTestId(`user-delete-${deleteTarget.id}`).first().click()
  await page.getByTestId('dialog-confirm').click()
  await expect
    .poll(
      async () => {
        await page.reload()
        return main.getByTestId(`user-row-${deleteTarget.id}`).count()
      },
      { timeout: 20_000 },
    )
    .toBe(0)
})

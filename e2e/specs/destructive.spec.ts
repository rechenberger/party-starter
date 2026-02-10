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
  await page.getByTestId('delete-org-button').click()
  await page.getByTestId('dialog-confirm').click()
  await expect(page).not.toHaveURL(new RegExp(`/org/${orgSlug}/settings`))

  await page.goto('/users')
  await expect(page.getByTestId(`user-card-${deleteTarget.id}`)).toBeVisible()
  await page.getByTestId(`user-delete-${deleteTarget.id}`).click()
  await page.getByTestId('dialog-confirm').click()
  await page.reload()
  await expect(page.getByTestId(`user-card-${deleteTarget.id}`)).toHaveCount(0)
})

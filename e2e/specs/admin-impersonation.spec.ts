import { expect, test } from '@playwright/test'
import { loginWithCredentials } from '../support/auth'
import { getPartitionForWorker } from '../support/seed-manifest'

test('admin can impersonate another admin and switch back', async ({
  page,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const owner = partition.users.owner
  const adminAlt = partition.users.adminAlt

  await loginWithCredentials({
    page,
    email: owner.email,
    password: owner.password,
  })

  await page.goto('/users')

  await page.getByTestId(`impersonate-button-${adminAlt.id}`).click()
  const adminAltImpersonateButton = page.getByTestId(
    `impersonate-button-${adminAlt.id}`,
  )
  await expect(adminAltImpersonateButton).toBeDisabled()
  await expect(adminAltImpersonateButton).toHaveAttribute(
    'title',
    /current user/i,
  )

  await page.getByTestId(`impersonate-button-${owner.id}`).click()
  const ownerImpersonateButton = page.getByTestId(
    `impersonate-button-${owner.id}`,
  )
  await expect(ownerImpersonateButton).toBeDisabled()
  await expect(ownerImpersonateButton).toHaveAttribute('title', /current user/i)
})

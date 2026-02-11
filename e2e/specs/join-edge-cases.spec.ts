import { expect, test } from '@playwright/test'
import { loginWithCredentials } from '../support/auth'
import { getPartitionForWorker } from '../support/seed-manifest'

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3000'

test('join flow handles expired/maxed/invalid codes, cancel, and already-member state', async ({
  page,
  browser,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const orgSlug = partition.orgs.joinEdge
  const codes = partition.inviteCodes.joinEdge
  const owner = partition.users.owner
  const candidate = partition.users.candidate

  await loginWithCredentials({
    page,
    email: candidate.email,
    password: candidate.password,
  })

  await page.goto(`/join/${orgSlug}/${codes.expired}`)
  await expect(page.getByText(/invalid invitation/i).first()).toBeVisible()
  await expect(page.getByText(/expired/i).first()).toBeVisible()

  await page.goto(`/join/${orgSlug}/${codes.maxed}`)
  await expect(page.getByText(/invalid invitation/i).first()).toBeVisible()
  await expect(page.getByText(/maximum number of uses/i).first()).toBeVisible()

  await page.goto(`/join/${orgSlug}/definitely-not-a-real-code`)
  await expect(page.getByText(/page not found/i)).toBeVisible()

  await page.goto(`/join/${orgSlug}/${codes.valid}`)
  await expect(page.getByTestId('join-org-submit').first()).toBeVisible()
  await page.getByTestId('join-org-cancel').first().click()
  await expect(page).not.toHaveURL(/\/join\//)

  const ownerContext = await browser.newContext({ baseURL })
  const ownerPage = await ownerContext.newPage()

  await loginWithCredentials({
    page: ownerPage,
    email: owner.email,
    password: owner.password,
  })

  await ownerPage.goto(`/org/${orgSlug}/settings/members`)
  await expect(
    ownerPage.getByTestId(`member-row-${candidate.id}`).first(),
  ).toHaveCount(0)

  await ownerPage.goto(`/join/${orgSlug}/${codes.valid}`)
  await expect(ownerPage.getByText(/successfully joined/i).first()).toBeVisible()
  await expect(ownerPage.getByTestId('join-org-submit')).toHaveCount(0)
  await ownerContext.close()
})

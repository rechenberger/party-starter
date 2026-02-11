import { expect, test } from '@playwright/test'
import { loginWithCredentials } from '../support/auth'
import { getPartitionForWorker } from '../support/seed-manifest'

test('non-admin member has read-only members view, can search, and can leave organization', async ({
  page,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const owner = partition.users.owner
  const memberReadonly = partition.users.memberReadonly
  const orgSlug = partition.orgs.membersReadonly

  await loginWithCredentials({
    page,
    email: memberReadonly.email,
    password: memberReadonly.password,
  })

  await page.goto(`/org/${orgSlug}/settings/members`)
  const main = page.getByRole('main').first()

  const ownerRow = main.getByTestId(`member-row-${owner.id}`).first()
  const memberRow = main.getByTestId(`member-row-${memberReadonly.id}`).first()

  await expect(ownerRow).toBeVisible()
  await expect(memberRow).toBeVisible()

  await expect(ownerRow.getByRole('combobox')).toHaveCount(0)
  await expect(memberRow.getByRole('combobox')).toHaveCount(0)
  await expect(page.getByTestId('invite-normal-create-button')).toHaveCount(0)
  await expect(page.getByTestId('invite-mail-create-button')).toHaveCount(0)

  await expect(
    ownerRow.getByTestId(`member-kick-${owner.id}`).first(),
  ).toHaveCount(0)
  await expect(
    memberRow.getByTestId(`member-kick-${memberReadonly.id}`).first(),
  ).toBeVisible()

  const searchInput = main.getByPlaceholder(/search members by name or email/i)
  await searchInput.fill(owner.email)
  await expect(ownerRow).toBeVisible()
  await expect(memberRow).toHaveCount(0)

  await main.getByRole('button', { name: /clear search/i }).click()
  await expect(memberRow).toBeVisible()

  await memberRow.getByTestId(`member-kick-${memberReadonly.id}`).click()
  await page.getByTestId('dialog-confirm').click()
  await expect(page).not.toHaveURL(new RegExp(`/org/${orgSlug}/settings/members`))

  await page.goto(`/org/${orgSlug}/settings/members`)
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
})

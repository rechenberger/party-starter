import { expect, test } from '@playwright/test'
import { loginWithCredentials } from '../support/auth'
import { getPartitionForWorker } from '../support/seed-manifest'

test.describe.configure({ mode: 'serial' })

test('organization members can be managed and last-admin guard is enforced', async ({
  page,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const owner = partition.users.owner
  const member = partition.users.member
  const membersOrgSlug = partition.orgs.members

  await loginWithCredentials({
    page,
    email: owner.email,
    password: owner.password,
  })

  await page.goto(`/org/${membersOrgSlug}/settings/members`)

  const memberTrigger = page.getByTestId(`member-role-trigger-${member.id}`)

  await memberTrigger.click()
  await page.getByTestId(`member-role-option-${member.id}-admin`).click()
  await page.reload()
  await expect(
    page.getByTestId(`member-role-trigger-${member.id}`),
  ).toContainText(/admin/i)

  await page.getByTestId(`member-role-trigger-${member.id}`).click()
  await page.getByTestId(`member-role-option-${member.id}-member`).click()
  await page.reload()
  await expect(
    page.getByTestId(`member-role-trigger-${member.id}`),
  ).toContainText(/member/i)

  await page.getByTestId(`member-role-trigger-${owner.id}`).click()
  await page.getByTestId(`member-role-option-${owner.id}-member`).click()
  await expect(page.getByText(/last admin/i)).toBeVisible()

  await page.getByTestId(`member-kick-${member.id}`).click()
  await page.getByTestId('dialog-confirm').click()
  await page.reload()
  await expect(page.getByTestId(`member-row-${member.id}`)).toHaveCount(0)
})

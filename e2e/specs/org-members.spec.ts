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

  const main = page.getByRole('main').first()
  const getRoleTrigger = (userId: string) =>
    main
      .getByTestId(`member-row-${userId}`)
      .first()
      .getByRole('combobox')
      .first()

  const setRole = async ({
    userId,
    role,
  }: {
    userId: string
    role: 'admin' | 'member'
  }) => {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const trigger = getRoleTrigger(userId)
      const currentText = ((await trigger.textContent()) ?? '')
        .trim()
        .toLowerCase()

      if (currentText.includes(role)) {
        return
      }

      await trigger.click()
      await page
        .locator(`[data-testid="member-role-option-${userId}-${role}"]:visible`)
        .first()
        .click()

      await expect
        .poll(
          async () => {
            await page.reload()
            const afterText = ((await getRoleTrigger(userId).textContent()) ?? '')
              .trim()
              .toLowerCase()
            return afterText
          },
          { timeout: 12_000 },
        )
        .toContain(role)

      const afterText = ((await getRoleTrigger(userId).textContent()) ?? '')
        .trim()
        .toLowerCase()
      if (afterText.includes(role)) {
        return
      }
    }
    throw new Error(`Failed to set role ${role} for ${userId}`)
  }

  await setRole({ userId: member.id, role: 'member' })
  await setRole({ userId: member.id, role: 'admin' })
  await setRole({ userId: member.id, role: 'member' })

  await expect(getRoleTrigger(owner.id)).toContainText(/admin/i)

  await getRoleTrigger(owner.id).click()
  await page
    .locator(`[data-testid="member-role-option-${owner.id}-member"]:visible`)
    .first()
    .click()
  await expect(page.getByText(/last admin/i).first()).toBeVisible()

  await main
    .getByTestId(`member-row-${member.id}`)
    .first()
    .getByTestId(`member-kick-${member.id}`)
    .first()
    .click()
  await page.locator('[data-testid="dialog-confirm"]:visible').first().click()

  // Wait until the kick action finished before forcing reloads, otherwise the
  // request can get interrupted and the member row remains.
  await expect
    .poll(
      async () => {
        const memberRow = main.getByTestId(`member-row-${member.id}`).first()
        const rowCount = await memberRow.count()
        if (rowCount === 0) {
          return 'removed'
        }
        const kickButton = memberRow
          .getByTestId(`member-kick-${member.id}`)
          .first()
        return (await kickButton.isDisabled()) ? 'processing' : 'idle'
      },
      { timeout: 20_000 },
    )
    .not.toBe('processing')

  await expect
    .poll(
      async () => {
        await page.reload()
        return main.getByTestId(`member-row-${member.id}`).count()
      },
      { timeout: 25_000 },
    )
    .toBe(0)
})

import { expect, test } from '@playwright/test'
import { loginWithCredentials } from '../support/auth'
import { waitForCapturedMail } from '../support/mail-capture'
import { getPartitionForWorker } from '../support/seed-manifest'

test.describe.configure({ mode: 'serial' })

test('normal invite codes can be deleted and mail invites can be resent and deleted', async ({
  page,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const owner = partition.users.owner
  const orgSlug = partition.orgs.joinEdge

  await loginWithCredentials({
    page,
    email: owner.email,
    password: owner.password,
  })

  await page.goto(`/org/${orgSlug}/settings/members`)

  const normalCodeRows = page.locator('[data-testid^="invite-code-row-"]')
  const beforeCodeIds = await normalCodeRows.evaluateAll((rows) => {
    return rows
      .map((row) => row.getAttribute('data-invite-code'))
      .filter((id): id is string => !!id)
  })

  await page.getByTestId('invite-normal-create-button').click()
  await page.getByTestId('invite-create-submit').click()

  let createdCodeId: string | null = null
  await expect
    .poll(
      async () => {
        const currentIds = await normalCodeRows.evaluateAll((rows) => {
          return rows
            .map((row) => row.getAttribute('data-invite-code'))
            .filter((id): id is string => !!id)
        })
        createdCodeId =
          currentIds.find((id) => !beforeCodeIds.includes(id)) ?? null
        return createdCodeId
      },
      { timeout: 15_000 },
    )
    .not.toBeNull()

  if (!createdCodeId) {
    throw new Error('Expected a newly created invitation code id')
  }

  const createdCodeRow = page
    .locator(`[data-testid="invite-code-row-${createdCodeId}"]`)
    .first()
  await expect(createdCodeRow).toBeVisible()
  await createdCodeRow.locator('button[title="Delete Code"]').first().click()
  await page.getByTestId('dialog-confirm').first().click()
  await expect(createdCodeRow).toHaveCount(0)

  const receiverEmail = `e2e-resend-${partition.index}-${Date.now()}@example.com`
  await page.getByTestId('invite-mail-create-button').click()
  await page.getByTestId('invite-email-receiver-input').fill(receiverEmail)
  await page.getByTestId('invite-email-receiver-input').press('Enter')

  const firstMailStart = Date.now()
  await page.getByTestId('invite-email-submit').click()
  await waitForCapturedMail({
    to: receiverEmail,
    template: 'org-invite',
    createdAfterMs: firstMailStart,
    timeoutMs: 20_000,
  })

  const mailRow = page
    .locator('[data-testid^="invite-mail-row-"]')
    .filter({ hasText: receiverEmail })
    .first()
  await expect(mailRow).toBeVisible()

  const resendMailStart = Date.now()
  await mailRow.getByTitle(/resend invitation/i).click()
  await page.getByTestId('dialog-confirm').first().click()
  await waitForCapturedMail({
    to: receiverEmail,
    template: 'org-invite',
    createdAfterMs: resendMailStart,
    timeoutMs: 20_000,
  })

  await mailRow.getByTitle(/delete/i).click()
  await page.getByTestId('dialog-confirm').first().click()
  await expect(mailRow).toHaveCount(0)
})

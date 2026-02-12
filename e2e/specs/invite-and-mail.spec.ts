import { expect, type Page, test } from '@playwright/test'
import { baseURL, loginWithCredentials } from '../support/auth'
import { extractJoinUrl, waitForCapturedMail } from '../support/mail-capture'
import { getPartitionForWorker } from '../support/seed-manifest'

const maybeLoginOnCurrentPage = async ({
  page,
  email,
  password,
}: {
  page: Page
  email: string
  password: string
}) => {
  const loginEmail = page.getByTestId('login-email').first()
  const hasLoginForm = await loginEmail
    .isVisible({ timeout: 1_500 })
    .catch(() => false)

  if (!hasLoginForm) {
    return
  }

  await loginEmail.fill(email)
  await page.getByTestId('login-password').first().fill(password)
  await page.getByTestId('login-submit').first().click()
  await expect(page).not.toHaveURL(/\/auth\/login/, { timeout: 20_000 })
}

const completeJoinFlow = async ({
  page,
  joinUrl,
  orgSlug,
  userId,
  email,
  password,
}: {
  page: Page
  joinUrl: string
  orgSlug: string
  userId: string
  email: string
  password: string
}) => {
  await loginWithCredentials({ page, email, password })
  await page.goto(joinUrl)
  await maybeLoginOnCurrentPage({ page, email, password })
  await page.goto(joinUrl)

  const joinButton = page.getByTestId('join-org-submit').first()
  const joinButtonVisible = await joinButton
    .waitFor({ state: 'visible', timeout: 15_000 })
    .then(() => true)
    .catch(() => false)

  if (joinButtonVisible) {
    await joinButton.click()
    await expect(page)
      .not.toHaveURL(/\/join\//, { timeout: 20_000 })
      .catch(() => undefined)
  }

  await expect(page).not.toHaveURL(/\/auth\/login/)
  await assertMemberVisible({
    page,
    orgSlug,
    userId,
    timeout: 40_000,
  })
}

const assertMemberVisible = async ({
  page,
  orgSlug,
  userId,
  timeout = 15_000,
}: {
  page: Page
  orgSlug: string
  userId: string
  timeout?: number
}) => {
  await page.goto(`/org/${orgSlug}/settings/members`)
  await expect(page).toHaveURL(new RegExp(`/org/${orgSlug}/settings/members`))
  await expect
    .poll(
      async () => {
        await page.reload()
        return page.getByTestId(`member-row-${userId}`).count()
      },
      {
        timeout,
      },
    )
    .toBeGreaterThan(0)
}

test.describe.configure({ mode: 'serial' })

test('normal invites and mail invites can be created and consumed', async ({
  page,
  browser,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const owner = partition.users.owner
  const candidate = partition.users.candidate
  const mailUser = partition.users.mailUser
  const invitesOrgSlug = partition.orgs.invites

  await loginWithCredentials({
    page,
    email: owner.email,
    password: owner.password,
  })

  await page.goto(`/org/${invitesOrgSlug}/settings/members`)

  await page.getByTestId('invite-normal-create-button').click()
  await page.getByTestId('invite-create-submit').click()

  const normalInviteRow = page
    .locator('[data-testid^="invite-code-row-"]')
    .first()
  await expect(normalInviteRow).toBeVisible()

  const codeId = await normalInviteRow.getAttribute('data-invite-code')
  if (!codeId) {
    throw new Error('Missing invite code id in row')
  }

  const candidateContext = await browser.newContext({ baseURL })
  const candidatePage = await candidateContext.newPage()

  await completeJoinFlow({
    page: candidatePage,
    joinUrl: `/join/${invitesOrgSlug}/${codeId}`,
    orgSlug: invitesOrgSlug,
    userId: candidate.id,
    email: candidate.email,
    password: candidate.password,
  })
  await candidateContext.close()

  await page.getByTestId('invite-mail-create-button').click()
  await page.getByTestId('invite-email-receiver-input').fill(mailUser.email)
  await page.getByTestId('invite-email-receiver-input').press('Enter')
  await page.getByTestId('invite-email-submit').click()

  const capturedMail = await waitForCapturedMail({
    to: mailUser.email,
    template: 'org-invite',
  })

  const joinUrl = extractJoinUrl(capturedMail.html || capturedMail.text)

  const mailContext = await browser.newContext({ baseURL })
  const mailPage = await mailContext.newPage()

  await completeJoinFlow({
    page: mailPage,
    joinUrl,
    orgSlug: invitesOrgSlug,
    userId: mailUser.id,
    email: mailUser.email,
    password: mailUser.password,
  })
  await mailContext.close()
})

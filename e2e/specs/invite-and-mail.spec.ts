import { expect, type Page, test } from '@playwright/test'
import { loginWithCredentials, setEnglishLocale } from '../support/auth'
import { extractJoinUrl, waitForCapturedMail } from '../support/mail-capture'
import { getPartitionForWorker } from '../support/seed-manifest'

const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:3000'

const loginFromCurrentPage = async ({
  page,
  email,
  password,
}: {
  page: Page
  email: string
  password: string
}) => {
  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()
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

  await setEnglishLocale(candidatePage)
  await candidatePage.goto(`/join/${invitesOrgSlug}/${codeId}`)

  if (candidatePage.url().includes('/auth/login')) {
    await loginFromCurrentPage({
      page: candidatePage,
      email: candidate.email,
      password: candidate.password,
    })
  }

  await candidatePage.getByTestId('join-org-submit').click()
  await expect(candidatePage).toHaveURL(new RegExp(`/org/${invitesOrgSlug}`))
  await candidateContext.close()

  await page.goto(`/org/${invitesOrgSlug}/settings/members`)
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

  await setEnglishLocale(mailPage)
  await mailPage.goto(joinUrl)

  if (mailPage.url().includes('/auth/login')) {
    await loginFromCurrentPage({
      page: mailPage,
      email: mailUser.email,
      password: mailUser.password,
    })
  }

  await mailPage.getByTestId('join-org-submit').click()
  await expect(mailPage).toHaveURL(new RegExp(`/org/${invitesOrgSlug}`))
  await mailContext.close()
})

import { expect, test } from '@playwright/test'
import { baseURL, setEnglishLocale } from '../support/auth'
import { extractVerifyUrl, waitForCapturedMail } from '../support/mail-capture'
import { getPartitionForWorker } from '../support/seed-manifest'

test.describe.configure({ mode: 'serial' })

test('register requires email verification and credentials login works after verification', async ({
  page,
  browser,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const email = `e2e-register-${partition.index}-${Date.now()}@example.com`
  const password = `RegisterPass!${partition.index}`

  await setEnglishLocale(page)
  await page.goto('/auth/login')
  await page.getByTestId('login-toggle-mode').click()

  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('register-confirm-password').fill(password)

  const acceptTerms = page.getByRole('checkbox').first()
  await acceptTerms.click()
  await expect(acceptTerms).toHaveAttribute('data-state', 'checked')

  const registerMailStart = Date.now()
  await page.getByTestId('login-submit').click()
  await expect
    .poll(
      async () => {
        return await page.evaluate(() => document.cookie.includes('locale=en'))
      },
      { timeout: 20_000 },
    )
    .toBe(true)
  await expect(page).toHaveURL(/\/auth\/check-mail/, { timeout: 20_000 })

  await waitForCapturedMail({
    to: email,
    template: 'verify-email',
    createdAfterMs: registerMailStart,
    timeoutMs: 20_000,
  })

  const verificationContext = await browser.newContext({ baseURL })
  const verificationPage = await verificationContext.newPage()
  await setEnglishLocale(verificationPage)
  await verificationPage.goto('/auth/login')
  await verificationPage.getByTestId('login-email').fill(email)
  await verificationPage.getByTestId('login-password').fill(password)

  const resendMailStart = Date.now()
  await verificationPage.getByTestId('login-submit').click()
  await expect(verificationPage).toHaveURL(/\/auth\/login/)

  const resendMail = await waitForCapturedMail({
    to: email,
    template: 'verify-email',
    createdAfterMs: resendMailStart,
    timeoutMs: 20_000,
  })

  const verifyUrl = extractVerifyUrl(resendMail.text || resendMail.html)
  await verificationPage.goto(verifyUrl)
  await expect(verificationPage).not.toHaveURL(/\/auth\/check-mail/, {
    timeout: 25_000,
  })
  await verificationContext.close()

  const credentialsContext = await browser.newContext({ baseURL })
  const credentialsPage = await credentialsContext.newPage()
  await setEnglishLocale(credentialsPage)
  await credentialsPage.goto('/auth/login')
  await credentialsPage.getByTestId('login-email').fill(email)
  await credentialsPage.getByTestId('login-password').fill(password)
  await credentialsPage.getByTestId('login-submit').click()
  await expect(credentialsPage).not.toHaveURL(/\/auth\/login/)
  await credentialsContext.close()
})

test('forgot password email link resets credentials password', async ({
  page,
  browser,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const user = partition.users.passwordReset

  await setEnglishLocale(page)
  await page.goto('/auth/login')

  await page.getByTestId('login-email').fill(user.email)
  await page.getByRole('button', { name: /forgot password/i }).click()
  await expect(page.getByTestId('login-password')).toHaveCount(0)

  const forgotMailStart = Date.now()
  await page.getByTestId('login-submit').click()
  await expect(page).toHaveURL(/\/auth\/check-mail/, { timeout: 20_000 })

  const forgotMail = await waitForCapturedMail({
    to: user.email,
    template: 'verify-email',
    createdAfterMs: forgotMailStart,
    timeoutMs: 20_000,
  })
  const verifyUrl = extractVerifyUrl(forgotMail.text || forgotMail.html)

  const resetContext = await browser.newContext({ baseURL })
  const resetPage = await resetContext.newPage()
  await setEnglishLocale(resetPage)
  await resetPage.goto(verifyUrl)

  const hasChangeForm = await resetPage
    .getByTestId('change-password-input')
    .isVisible({ timeout: 3_000 })
    .catch(() => false)

  if (!hasChangeForm) {
    await resetPage.goto('/auth/change-password')
  }

  await expect(resetPage.getByTestId('change-password-input')).toBeVisible({
    timeout: 25_000,
  })

  const nextPassword = `${user.password}-next`
  await resetPage.getByTestId('change-password-input').fill(nextPassword)
  await resetPage.getByTestId('change-password-confirm').fill(nextPassword)
  await resetPage.getByTestId('change-password-submit').click()
  await expect(resetPage).not.toHaveURL(/\/auth\/change-password/)
  await resetContext.close()

  const freshContext = await browser.newContext({ baseURL })
  const freshPage = await freshContext.newPage()
  await setEnglishLocale(freshPage)
  await freshPage.goto('/auth/login')

  await freshPage.getByTestId('login-email').fill(user.email)
  await freshPage.getByTestId('login-password').fill(user.password)
  await freshPage.getByTestId('login-submit').click()
  await expect(freshPage).toHaveURL(/\/auth\/login/)

  await freshPage.getByTestId('login-password').fill(nextPassword)
  await freshPage.getByTestId('login-submit').click()
  await expect(freshPage).not.toHaveURL(/\/auth\/login/)
  await freshContext.close()
})

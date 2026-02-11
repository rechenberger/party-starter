import { expect, test } from '@playwright/test'
import { baseURL, loginWithCredentials, setEnglishLocale } from '../support/auth'
import { getPartitionForWorker } from '../support/seed-manifest'

test('credentials login plus username/password update works', async ({
  page,
  browser,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const user = partition.users.victim

  await loginWithCredentials({
    page,
    email: user.email,
    password: user.password,
  })

  const nextUsername = `e2e-victim-${partition.index}-${Date.now()}`

  await page.goto('/auth/change-username')
  await page.getByTestId('change-username-input').fill(nextUsername)
  await page.getByTestId('change-username-submit').click()
  await expect(page).not.toHaveURL(/\/auth\/change-username/)

  const nextPassword = `${user.password}-next`

  await page.goto('/auth/change-password')
  await page.getByTestId('change-password-input').fill(nextPassword)
  await page.getByTestId('change-password-confirm').fill(nextPassword)
  await page.getByTestId('change-password-submit').click()
  await expect(page).not.toHaveURL(/\/auth\/change-password/)

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

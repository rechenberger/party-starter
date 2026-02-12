import { expect, test } from '@playwright/test'
import {
  baseURL,
  loginWithCredentials,
  setEnglishLocale,
} from '../support/auth'
import { getPartitionForWorker } from '../support/seed-manifest'

test('root route respects locale cookie for anonymous users', async ({
  page,
}) => {
  await setEnglishLocale(page)
  await page.goto('/')
  await expect(page).toHaveURL(/\/en$/)
  await expect(page.getByText(/welcome to party/i).first()).toBeVisible()

  await page.context().clearCookies()
  await page.context().addCookies([
    {
      name: 'locale',
      value: 'de',
      url: baseURL,
    },
  ])
  await page.goto('/')
  await expect(page).toHaveURL(/\/de$/)
  await expect(page.getByText(/willkommen im party/i).first()).toBeVisible()
})

test('anonymous auth-protected routes redirect to login with redirect param', async ({
  page,
}) => {
  await setEnglishLocale(page)

  await page.goto('/app')
  await expect(page).toHaveURL(/\/auth\/login\?redirect=/)

  await page.goto('/auth/change-password')
  await expect(page).toHaveURL(/\/auth\/login/)

  await page.goto('/auth/change-username')
  await expect(page).toHaveURL(/\/auth\/login/)
})

test('logged-in root and login page redirects behave as expected', async ({
  page,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const owner = partition.users.owner

  await loginWithCredentials({
    page,
    email: owner.email,
    password: owner.password,
  })

  await page.goto('/')
  await expect(page).toHaveURL(/\/app/)

  await page.goto('/auth/login?redirect=%2Fusers')
  await expect(page).toHaveURL(/\/users/)
})

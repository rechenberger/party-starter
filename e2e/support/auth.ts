import { expect, type Page } from '@playwright/test'

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:3000'

export const setEnglishLocale = async (page: Page) => {
  await page.context().addCookies([
    {
      name: 'locale',
      value: 'en',
      url: baseUrl,
    },
  ])
}

export const loginWithCredentials = async ({
  page,
  email,
  password,
}: {
  page: Page
  email: string
  password: string
}) => {
  await setEnglishLocale(page)
  await page.goto('/auth/login')

  await page.getByTestId('login-email').fill(email)
  await page.getByTestId('login-password').fill(password)
  await page.getByTestId('login-submit').click()

  await expect(page).not.toHaveURL(/\/auth\/login/)
}

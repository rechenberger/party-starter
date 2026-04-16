import { expect, test, type Page } from '@playwright/test'
import { baseURL, loginWithCredentials } from '../support/auth'
import { getPartitionForWorker } from '../support/seed-manifest'

const setLastUsedOrgCookie = async ({
  page,
  orgSlug,
}: {
  page: Page
  orgSlug: string
}) => {
  await page.context().addCookies([
    {
      name: 'LastusedOrg',
      value: orgSlug,
      url: baseURL,
    },
  ])
}

test('zero-org users get an org auto-created and see it in the switcher', async ({
  page,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const candidate = partition.users.candidate

  await loginWithCredentials({
    page,
    email: candidate.email,
    password: candidate.password,
  })

  await page.goto('/app')
  await expect(page).toHaveURL(new RegExp(`/org/${candidate.id}$`))
  await expect(page.getByTestId('sidebar-org-switcher-trigger')).toContainText(
    `E2E Candidate ${partition.index}`,
  )
})

test('global main routes keep their URL and use the cookie-selected org context', async ({
  page,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const owner = partition.users.owner

  await loginWithCredentials({
    page,
    email: owner.email,
    password: owner.password,
  })

  await setLastUsedOrgCookie({
    page,
    orgSlug: partition.orgs.invites,
  })

  await page.goto('/users')
  await expect(page).toHaveURL(/\/users$/)
  await expect(page.getByTestId('sidebar-org-switcher-trigger')).toContainText(
    `E2E Invites Org ${partition.index}`,
  )
  await expect(page.getByRole('link', { name: 'Say Hello' })).toHaveAttribute(
    'href',
    `/org/${partition.orgs.invites}?say=hello`,
  )
})

test('invalid LastusedOrg values fall back to the latest membership deterministically', async ({
  page,
}, testInfo) => {
  const partition = getPartitionForWorker(testInfo)
  const owner = partition.users.owner

  await loginWithCredentials({
    page,
    email: owner.email,
    password: owner.password,
  })

  await setLastUsedOrgCookie({
    page,
    orgSlug: 'missing-org',
  })

  await page.goto('/users')
  await expect(page).toHaveURL(/\/users$/)
  await expect(page.getByTestId('sidebar-org-switcher-trigger')).toContainText(
    `E2E Join Edge Org ${partition.index}`,
  )
  expect(
    await page.evaluate(
      ([name, value]) => document.cookie.includes(`${name}=${value}`),
      ['LastusedOrg', partition.orgs.joinEdge] as const,
    ),
  ).toBe(true)
})

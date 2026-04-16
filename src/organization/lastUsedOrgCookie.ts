export const LAST_USED_ORG_COOKIE_NAME = 'LastusedOrg'
export const LAST_USED_ORG_COOKIE_MAX_AGE = 31536000

export const serializeLastUsedOrgCookie = (orgSlug: string) => {
  return `${LAST_USED_ORG_COOKIE_NAME}=${orgSlug}; path=/; max-age=${LAST_USED_ORG_COOKIE_MAX_AGE}; samesite=lax`
}

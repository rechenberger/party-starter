import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

const role = v.union(v.literal('admin'), v.literal('member'))
const emailStatus = v.union(
  v.literal('queued'),
  v.literal('sent'),
  v.literal('skipped'),
  v.literal('failed'),
)
const cronStatus = v.union(
  v.literal('running'),
  v.literal('success'),
  v.literal('error'),
)

export default defineSchema({
  user: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
    role: v.optional(v.union(v.null(), v.string())),
    banned: v.optional(v.union(v.null(), v.boolean())),
    banReason: v.optional(v.union(v.null(), v.string())),
    banExpires: v.optional(v.union(v.null(), v.number())),
  })
    .index('email_name', ['email', 'name'])
    .index('name', ['name'])
    .index('role', ['role']),
  session: defineTable({
    expiresAt: v.number(),
    token: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    ipAddress: v.optional(v.union(v.null(), v.string())),
    userAgent: v.optional(v.union(v.null(), v.string())),
    userId: v.string(),
    impersonatedBy: v.optional(v.union(v.null(), v.string())),
  })
    .index('expiresAt', ['expiresAt'])
    .index('expiresAt_userId', ['expiresAt', 'userId'])
    .index('token', ['token'])
    .index('userId', ['userId'])
    .index('impersonatedBy', ['impersonatedBy']),
  account: defineTable({
    accountId: v.string(),
    providerId: v.string(),
    userId: v.string(),
    accessToken: v.optional(v.union(v.null(), v.string())),
    refreshToken: v.optional(v.union(v.null(), v.string())),
    idToken: v.optional(v.union(v.null(), v.string())),
    accessTokenExpiresAt: v.optional(v.union(v.null(), v.number())),
    refreshTokenExpiresAt: v.optional(v.union(v.null(), v.number())),
    scope: v.optional(v.union(v.null(), v.string())),
    password: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('accountId', ['accountId'])
    .index('accountId_providerId', ['accountId', 'providerId'])
    .index('providerId_userId', ['providerId', 'userId'])
    .index('userId', ['userId']),
  verification: defineTable({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('expiresAt', ['expiresAt'])
    .index('identifier', ['identifier']),
  jwks: defineTable({
    publicKey: v.string(),
    privateKey: v.string(),
    createdAt: v.number(),
  }),
  rateLimit: defineTable({
    key: v.optional(v.union(v.null(), v.string())),
    count: v.optional(v.union(v.null(), v.number())),
    lastRequest: v.optional(v.union(v.null(), v.number())),
  }).index('key', ['key']),
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdById: v.optional(v.union(v.null(), v.string())),
    updatedById: v.optional(v.union(v.null(), v.string())),
  })
    .index('slug', ['slug'])
    .index('createdById', ['createdById']),
  organizationMemberships: defineTable({
    userId: v.string(),
    organizationId: v.string(),
    role,
    invitationCodeId: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdById: v.optional(v.union(v.null(), v.string())),
    updatedById: v.optional(v.union(v.null(), v.string())),
  })
    .index('by_user', ['userId'])
    .index('by_org', ['organizationId'])
    .index('by_org_user', ['organizationId', 'userId']),
  inviteCodes: defineTable({
    code: v.string(),
    organizationId: v.string(),
    role,
    comment: v.optional(v.union(v.null(), v.string())),
    expiresAt: v.optional(v.union(v.null(), v.number())),
    usesMax: v.optional(v.union(v.null(), v.number())),
    usesCurrent: v.optional(v.union(v.null(), v.number())),
    sentToEmail: v.optional(v.union(v.null(), v.string())),
    deletedAt: v.optional(v.union(v.null(), v.number())),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdById: v.optional(v.union(v.null(), v.string())),
    updatedById: v.optional(v.union(v.null(), v.string())),
  })
    .index('by_code', ['code'])
    .index('by_org', ['organizationId'])
    .index('by_org_email', ['organizationId', 'sentToEmail']),
  emailAllowlist: defineTable({
    pattern: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdById: v.optional(v.union(v.null(), v.string())),
    updatedById: v.optional(v.union(v.null(), v.string())),
  }).index('pattern', ['pattern']),
  emailLog: defineTable({
    template: v.string(),
    provider: v.string(),
    fromEmail: v.string(),
    toEmail: v.string(),
    subject: v.string(),
    html: v.string(),
    text: v.string(),
    locale: v.string(),
    status: emailStatus,
    sentAt: v.optional(v.union(v.null(), v.number())),
    errorText: v.optional(v.union(v.null(), v.string())),
    runId: v.optional(v.union(v.null(), v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_created', ['createdAt'])
    .index('by_template_to', ['template', 'toEmail'])
    .index('by_run', ['runId'])
    .index('by_status', ['status']),
  cronRuns: defineTable({
    cronName: v.string(),
    status: cronStatus,
    statusText: v.optional(v.union(v.null(), v.string())),
    endedAt: v.optional(v.union(v.null(), v.number())),
    heartbeat: v.optional(v.union(v.null(), v.number())),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdById: v.optional(v.union(v.null(), v.string())),
    updatedById: v.optional(v.union(v.null(), v.string())),
  })
    .index('by_cron', ['cronName'])
    .index('by_cron_created', ['cronName', 'createdAt']),
})

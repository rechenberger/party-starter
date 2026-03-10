import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireViewer } from './auth'

const now = () => Date.now()

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const getOrgBySlug = async (ctx: any, slug: string) => {
  return await ctx.db
    .query('organizations')
    .withIndex('slug', (q: any) => q.eq('slug', slug))
    .unique()
}

const getMembership = async (
  ctx: any,
  organizationId: string,
  userId: string,
) => {
  return await ctx.db
    .query('organizationMemberships')
    .withIndex('by_org_user', (q: any) =>
      q.eq('organizationId', organizationId).eq('userId', userId),
    )
    .unique()
}

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx)
    const name = `${args.name}`.trim()
    if (!name) {
      throw new ConvexError('Organization name is required')
    }

    const slug = slugify(name)
    const existing = await getOrgBySlug(ctx, slug)
    if (existing) {
      throw new ConvexError('Organization slug already exists')
    }

    const timestamp = now()
    const organizationId = await ctx.db.insert('organizations', {
      name,
      slug,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdById: viewer.effectiveUserId,
      updatedById: viewer.effectiveUserId,
    })

    await ctx.db.insert('organizationMemberships', {
      userId: viewer.effectiveUserId,
      organizationId: `${organizationId}`,
      role: 'admin',
      createdAt: timestamp,
      updatedAt: timestamp,
      createdById: viewer.effectiveUserId,
      updatedById: viewer.effectiveUserId,
      invitationCodeId: null,
    })

    return { id: `${organizationId}`, slug }
  },
})

export const myMemberships = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await requireViewer(ctx)
    const memberships = await ctx.db
      .query('organizationMemberships')
      .withIndex('by_user', (q: any) => q.eq('userId', viewer.effectiveUserId))
      .collect()

    const organizations = await ctx.db.query('organizations').collect()

    return memberships
      .map((membership) => {
        const org = organizations.find(
          (organization) => `${organization._id}` === membership.organizationId,
        )
        return org
          ? {
              id: `${membership._id}`,
              role: membership.role,
              organization: {
                id: `${org._id}`,
                slug: org.slug,
                name: org.name,
              },
            }
          : null
      })
      .filter(Boolean)
  },
})

export const myMembershipBySlug = query({
  args: {
    orgSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx)
    const org = await getOrgBySlug(ctx, `${args.orgSlug}`)
    if (!org) return null

    const membership = await getMembership(
      ctx,
      `${org._id}`,
      viewer.effectiveUserId,
    )
    if (!membership) return null

    return {
      org: {
        id: `${org._id}`,
        name: org.name,
        slug: org.slug,
        createdAt: org.createdAt,
      },
      membership: {
        id: `${membership._id}`,
        userId: membership.userId,
        role: membership.role,
        createdAt: membership.createdAt,
      },
    }
  },
})

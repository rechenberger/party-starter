import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { requireAdminViewer } from './auth'

const emailStatus = v.union(
  v.literal('queued'),
  v.literal('sent'),
  v.literal('skipped'),
  v.literal('failed'),
)

export const capture = mutation({
  args: {
    template: v.string(),
    provider: v.string(),
    fromEmail: v.string(),
    toEmail: v.string(),
    subject: v.string(),
    html: v.string(),
    text: v.string(),
    locale: v.string(),
    status: emailStatus,
    errorText: v.optional(v.union(v.null(), v.string())),
    runId: v.optional(v.union(v.null(), v.string())),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now()
    const id = await ctx.db.insert('emailLog', {
      template: `${args.template}`,
      provider: `${args.provider}`,
      fromEmail: `${args.fromEmail}`,
      toEmail: `${args.toEmail}`,
      subject: `${args.subject}`,
      html: `${args.html}`,
      text: `${args.text}`,
      locale: `${args.locale}`,
      status: args.status,
      errorText: args.errorText ?? null,
      runId: args.runId ?? null,
      sentAt: args.status === 'sent' ? timestamp : null,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    return { id: `${id}` }
  },
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdminViewer(ctx)
    const emails = await ctx.db.query('emailLog').collect()
    return emails.sort((a, b) => b.createdAt - a.createdAt)
  },
})

export const findCapturedMail = query({
  args: {
    to: v.string(),
    template: v.string(),
    createdAfterMs: v.optional(v.number()),
    runId: v.optional(v.union(v.null(), v.string())),
  },
  handler: async (ctx, args) => {
    const createdAfterMs = Number(args.createdAfterMs ?? 0)
    const emails = await ctx.db.query('emailLog').collect()

    return (
      emails
        .filter((email) => {
          const matchesRun = args.runId ? email.runId === args.runId : true
          return (
            email.template === args.template &&
            email.toEmail.toLowerCase() === `${args.to}`.toLowerCase() &&
            email.createdAt >= createdAfterMs &&
            matchesRun &&
            ['queued', 'sent', 'skipped'].includes(email.status)
          )
        })
        .sort((a, b) => b.createdAt - a.createdAt)[0] ?? null
    )
  },
})

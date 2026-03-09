import { mutation, query } from './_generated/server'
import { requireAdminViewer } from './auth'

export const capture = mutation({
  args: {
    template: null as any,
    provider: null as any,
    fromEmail: null as any,
    toEmail: null as any,
    subject: null as any,
    html: null as any,
    text: null as any,
    locale: null as any,
    status: null as any,
    errorText: null as any,
    runId: null as any,
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
    to: null as any,
    template: null as any,
    createdAfterMs: null as any,
    runId: null as any,
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

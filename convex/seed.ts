import { v } from 'convex/values'
import { authApi, createAuth } from './auth'
import { action } from './_generated/server'

const now = () => Date.now()

const seedNames = [
  'owner',
  'adminAlt',
  'member',
  'memberReadonly',
  'candidate',
  'mailUser',
  'victim',
  'passwordReset',
  'deleteTarget',
] as const

type SeedName = (typeof seedNames)[number]

const buildPassword = (name: SeedName, index: number) => {
  switch (name) {
    case 'owner':
      return `OwnerPass!${index}`
    case 'adminAlt':
      return `AdminAltPass!${index}`
    case 'member':
      return `MemberPass!${index}`
    case 'memberReadonly':
      return `MemberReadonlyPass!${index}`
    case 'candidate':
      return `CandidatePass!${index}`
    case 'mailUser':
      return `MailPass!${index}`
    case 'victim':
      return `VictimPass!${index}`
    case 'passwordReset':
      return `ResetPass!${index}`
    case 'deleteTarget':
      return `DeletePass!${index}`
  }
}

export const run = action({
  args: {
    runId: v.string(),
    workers: v.number(),
  },
  handler: async (ctx, args) => {
    const auth = createAuth(ctx)
    const partitions = []
    const existingUsers = await ctx.runQuery(authApi.findMany, {
      model: 'user',
      limit: 10_000,
      offset: 0,
    })

    for (let index = 0; index < Number(args.workers); index += 1) {
      const prefix = `e2e-${args.runId}-${index}`
      const users: Record<
        string,
        { id: string; email: string; password: string }
      > = {}

      for (const name of seedNames) {
        const email = `${prefix}.${name.replace(/[A-Z]/g, (match) => `.${match.toLowerCase()}`)}@example.com`
        const password = buildPassword(name, index)
        const role = name === 'owner' || name === 'adminAlt' ? 'admin' : 'user'

        let userId = existingUsers.find(
          (user: any) => user.email === email,
        )?._id
        if (!userId) {
          const result = await auth.api.signUpEmail({
            body: {
              email,
              password,
              name: `E2E ${name} ${index}`,
            },
          })
          userId = result.user.id
          await ctx.runMutation(authApi.updateOne, {
            input: {
              model: 'user',
              where: [{ field: '_id', value: userId }],
              update: { role },
            },
          })
        }

        users[name] = { id: userId, email, password }
      }

      partitions.push({
        index,
        orgs: {
          members: `${prefix}-members-org`,
          invites: `${prefix}-invites-org`,
          membersReadonly: `${prefix}-members-readonly-org`,
          joinEdge: `${prefix}-join-edge-org`,
        },
        inviteCodes: {
          joinEdge: {
            valid: `${prefix}-join-valid`,
            expired: `${prefix}-join-expired`,
            maxed: `${prefix}-join-maxed`,
          },
        },
        users,
      })
    }

    return {
      runId: `${args.runId}`,
      createdAt: new Date(now()).toISOString(),
      workers: Number(args.workers),
      partitions,
    }
  },
})

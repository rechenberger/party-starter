import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { crons } from '@/super-cron/crons'
import { eq } from 'drizzle-orm'
import { desc } from 'drizzle-orm'
import { CronExpressionParser } from 'cron-parser'
import { getCronRunStatus } from '@/super-cron/cronRunStatus'
import { z } from 'zod'

// CONFIG:
export const revalidate = 0
const TIMEOUT_IN_SECONDS = 10
export const maxDuration = 20 // 10s extra for route handling

const checks = [
  {
    name: 'Database',
    test: async () => {
      await db.query.users.findFirst()
    },
  },
  ...crons
    .filter((cron) => cron.isActive)
    .map((cron) => {
      return {
        name: `${cron.name} Cron`,
        test: async () => {
          const cronRun = await db.query.cronRun.findFirst({
            where: eq(schema.cronRun.cronName, cron.name),
            orderBy: [desc(schema.cronRun.createdAt)],
          })

          if (!cronRun) {
            throw new Error('Cron run not found')
          }

          const cronExpression = CronExpressionParser.parse(cron.schedule, {
            currentDate: cronRun.createdAt,
          })
          const nextRun = cronExpression.next().toDate()
          if (nextRun < new Date()) {
            throw new Error('Cron run is overdue')
          }

          const status = getCronRunStatus(cronRun)

          if (!status) {
            throw new Error('Cron run status not found')
          }

          if (status.value === 'success' || status.value === 'running') {
            return
          }

          throw new Error(status.value)
        },
      }
    }),
]

// HANDLER:
export const GET = async () => {
  const results = await Promise.all(
    checks.map(async (check) => {
      try {
        await Promise.race([
          check.test(),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error(`Timeout after ${TIMEOUT_IN_SECONDS}s`)),
              TIMEOUT_IN_SECONDS * 1000,
            ),
          ),
        ])
        return { name: check.name, success: true }
      } catch (e) {
        const parsed = z
          .object({
            message: z.string(),
          })
          .safeParse(e)

        return {
          name: check.name,
          success: false,
          error: parsed.success ? parsed.data?.message : 'Unknown error',
        }
      }
    }),
  )

  const success = !results.some((r) => !r.success)
  return new Response(JSON.stringify({ success, checks: results }, null, 2), {
    status: success ? 200 : 500,
  })
}

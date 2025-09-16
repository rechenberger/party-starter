import { db } from '@/db/db'
import { cronRun } from '@/db/schema'
import { eq } from 'drizzle-orm'
import ms from 'ms'
import { headers } from 'next/headers'
import { CronName } from './crons'

export const superCron = async ({
  cronName,
  cron,
}: {
  cronName: CronName
  cron: () => Promise<void>
}) => {
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    throw new Error('CRON_SECRET is not set')
  }

  const start = Date.now()
  console.time(`${cronName} Cronjob`)

  const authHeader = (await headers()).get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const [cronRunRecord] = await db
    .insert(cronRun)
    .values({
      cronName,
      status: 'running',
    })
    .returning()

  const interval = setInterval(async () => {
    const diff = Date.now() - start

    await db
      .update(cronRun)
      .set({
        heartbeat: new Date().toISOString(),
      })
      .where(eq(cronRun.id, cronRunRecord.id))

    if (diff > ms('11 minutes')) {
      console.log(
        `SODEFA-ALERT: ${cronName} ist kurz vorm untergehen. Schon ${(
          diff / ms('1 minute')
        ).toFixed(1)} mins gelaufen 😖`,
      )
    }
  }, ms('30 seconds'))

  try {
    await cron()

    await db
      .update(cronRun)
      .set({
        status: 'success',
        endedAt: new Date().toISOString(),
      })
      .where(eq(cronRun.id, cronRunRecord.id))

    return new Response('OK')
  } catch (error) {
    console.error(`SODEFA-ALERT: Cronjob ${cronName} failed`, error)

    await db
      .update(cronRun)
      .set({
        status: 'error',
        statusText: error instanceof Error ? error.message : String(error),
        endedAt: new Date().toISOString(),
      })
      .where(eq(cronRun.id, cronRunRecord.id))

    return new Response('Error', { status: 500 })
  } finally {
    clearInterval(interval)
    console.timeEnd(`${cronName} Cronjob`)
  }
}

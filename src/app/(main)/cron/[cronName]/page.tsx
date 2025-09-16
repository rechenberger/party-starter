import { notFoundIfNotAdmin } from '@/auth/getIsAdmin'
import { TopHeader } from '@/components/TopHeader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { db } from '@/db/db'
import { cronRun } from '@/db/schema'
import { getTranslations } from '@/i18n/getTranslations'
import { getCronRunStatusBadge } from '@/super-cron/cronRunStatus'
import { getCronByName } from '@/super-cron/getCron'
import { format, formatDistanceToNow, intervalToDuration } from 'date-fns'
import { desc, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { RunCronjobButton } from '../RunCronjobButton'

export default async function CronRunsPage({
  params,
}: {
  params: Promise<{ cronName: string }>
}) {
  await notFoundIfNotAdmin({ allowDev: true })
  const { cronName } = await params
  const decodedCronName = decodeURIComponent(cronName)
  const cron = getCronByName(decodedCronName)
  const t = await getTranslations()

  if (!cron) {
    notFound()
  }

  const cronRuns = await db.query.cronRun.findMany({
    where: eq(cronRun.cronName, decodedCronName),
    orderBy: [desc(cronRun.createdAt)],
    limit: 50,
  })

  const formatDuration = ({
    startTime,
    endTime,
  }: {
    startTime: Date
    endTime?: Date
  }) => {
    const start = new Date(startTime)
    const end = endTime ? new Date(endTime) : new Date()

    const duration = intervalToDuration({ start, end })

    if (duration.hours && duration.hours > 0) {
      return `${duration.hours}h ${duration.minutes || 0}m`
    } else if (duration.minutes && duration.minutes > 0) {
      return `${duration.minutes}m ${duration.seconds || 0}s`
    } else {
      return `${duration.seconds || 0}s`
    }
  }

  const getLastHeartbeat = (heartbeat?: Date) => {
    if (!heartbeat) return t.cron.noHeartbeat

    return formatDistanceToNow(new Date(heartbeat), {
      addSuffix: true,
      includeSeconds: true,
    })
  }

  return (
    <>
      <TopHeader>
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1">
            {t.cron.cronRuns}: {decodedCronName}
          </div>
          <span className="text-sm text-muted-foreground">
            {cronRuns.length} {t.cron.runs}
          </span>
          <RunCronjobButton cron={cron} />
        </div>
      </TopHeader>
      <div className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.cron.startedAt}</TableHead>
              <TableHead>{t.cron.status}</TableHead>
              <TableHead>{t.cron.duration}</TableHead>
              <TableHead>{t.cron.lastHeartbeat}</TableHead>
              <TableHead>{t.cron.endedAt}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cronRuns.map((run) => (
              <TableRow key={run.id}>
                <TableCell>
                  {format(new Date(run.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                </TableCell>
                <TableCell>{getCronRunStatusBadge(run)}</TableCell>
                <TableCell>
                  {formatDuration({
                    startTime: run.createdAt,
                    endTime: run.endedAt || undefined,
                  })}
                </TableCell>
                <TableCell title={run.heartbeat?.toISOString() || ''}>
                  {getLastHeartbeat(run.heartbeat || undefined)}
                </TableCell>
                <TableCell>
                  {run.endedAt
                    ? format(new Date(run.endedAt), 'MMM dd, yyyy HH:mm:ss')
                    : ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {cronRuns.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {t.cron.noCronRunsFound} &quot;{decodedCronName}&quot;.
          </div>
        )}
      </div>
    </>
  )
}

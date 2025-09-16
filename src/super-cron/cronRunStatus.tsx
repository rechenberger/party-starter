import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CronRun } from '@/db/schema-zod'
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'

const statusConfig = {
  running: {
    value: 'running',
    label: 'Running',
    icon: Clock,
    variant: 'default' as const,
    className: 'bg-blue-100 text-blue-800',
  },
  success: {
    value: 'success',
    label: 'Success',
    icon: CheckCircle,
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800',
  },
  error: {
    value: 'error',
    label: 'Error',
    icon: XCircle,
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800',
  },
  tookTooLong: {
    value: 'tookTooLong',
    label: 'Took Too Long',
    icon: AlertTriangle,
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800',
  },
  noHeartbeat: {
    value: 'noHeartbeat',
    label: 'Likely Dead',
    icon: AlertTriangle,
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800',
  },
} as const

export const getCronRunStatus = ({
  status: inputStatus,
  statusText,
  createdAt,
  endedAt,
  heartbeat,
}: CronRun) => {
  let status: string = inputStatus
  // Check if duration exceeds 800 seconds (13.33 minutes)
  const start = new Date(createdAt)
  const end = endedAt ? new Date(endedAt) : new Date()
  const durationMs = end.getTime() - start.getTime()
  const durationSeconds = Math.round(durationMs / 1000)
  const secondsSinceLastHeartbeat = heartbeat
    ? new Date().getTime() - new Date(heartbeat).getTime() / 1000
    : 0

  if (durationSeconds > 800) {
    status = 'tookTooLong'
  }
  if (secondsSinceLastHeartbeat > 35 && status === 'running') {
    status = 'noHeartbeat'
  }

  const config = statusConfig[status as keyof typeof statusConfig]
  if (!config) return null

  return config
}

export const getCronRunStatusBadge = (cronRun: CronRun) => {
  const config = getCronRunStatus(cronRun)

  if (!config) return null

  const Icon = config.icon

  const badge = (
    <Badge className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )

  if (!cronRun.statusText) {
    return badge
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent>
        <p>{cronRun.statusText}</p>
      </TooltipContent>
    </Tooltip>
  )
}

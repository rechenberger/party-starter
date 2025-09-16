export type CronPre = {
  name: string
  url: string
  schedule: string
  description: string
  isActive: boolean
}

// TODO: Add crons here
export const crons = [
  {
    name: 'Test',
    url: '/api/cron/test',
    schedule: '0 * * * *',
    description: 'Test cron',
    isActive: false,
  },
] as const satisfies CronPre[]

export type CronName = (typeof crons)[number]['name']
export type CronUrl = (typeof crons)[number]['url']

export type Cron = CronPre & {
  name: CronName
  url: CronUrl
}

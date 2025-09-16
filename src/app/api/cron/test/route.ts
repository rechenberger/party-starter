import { superCron } from '@/super-cron/superCron'

export const revalidate = 0
// export const maxDuration = 800 // ~13 minutes (max in vercel pro)

export const GET = async () => {
  return superCron({
    cronName: 'Test',
    cron: async () => {
      console.log('Test Cron started')
      await new Promise((resolve) => setTimeout(resolve, 40_000))
      console.log('Test Cron finished')
    },
  })
}

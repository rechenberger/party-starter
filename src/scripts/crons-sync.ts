import { crons } from '@/super-cron/crons'
import { readFile, writeFile } from 'fs/promises'

const main = async () => {
  const vercelJson = (await readFile('vercel.json', 'utf8')) || '{}'
  const vercelJsonObject = JSON.parse(vercelJson)
  vercelJsonObject.crons = crons
    .filter((cron) => cron.isActive)
    .map((cron) => {
      return {
        path: cron.url,
        schedule: cron.schedule,
      }
    })
  await writeFile(
    'vercel.json',
    JSON.stringify(vercelJsonObject, null, 2) + '\n',
  )
}

main()
  .then(() => {
    console.log('Syncing cron jobs to vercel.json done')
  })
  .catch(console.error)

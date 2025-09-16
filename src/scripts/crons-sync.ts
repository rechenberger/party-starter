import { crons } from '@/super-cron/crons'
import { readFile, writeFile } from 'fs/promises'

const main = async () => {
  const vercelJson = await readFile('vercel.json', 'utf8').catch(() => '{}')
  const vercelJsonObject = JSON.parse(vercelJson)
  const activeCrons = crons.filter((cron) => cron.isActive)

  if (activeCrons.length === 0 && (vercelJsonObject.crons ?? []).length === 0) {
    return
  }

  vercelJsonObject.crons = activeCrons.map((cron) => {
    return {
      path: cron.url,
      schedule: cron.schedule,
    }
  })
  vercelJsonObject.functions = {
    ...(vercelJsonObject.functions ?? {}),
    'src/app/api/cron/**/*': {
      maxDuration: 800,
    },
  }
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

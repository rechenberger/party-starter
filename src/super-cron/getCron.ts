import { crons } from './crons'

export const getCronByName = (name: string) => {
  return crons.find((cron) => cron.name === name)
}

export const getCronByUrl = (url: string) => {
  return crons.find((cron) => cron.url === url)
}

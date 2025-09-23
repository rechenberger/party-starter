import { throwIfNotAdmin } from '@/auth/getIsAdmin'
import { getTranslations } from '@/i18n/getTranslations'
import { BASE_URL } from '@/lib/config'
import { superAction } from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { Cron } from '@/super-cron/crons'

export const RunCronjobButton = async ({ cron }: { cron: Cron }) => {
  const t = await getTranslations()

  return (
    <ActionButton
      size="sm"
      catchToast
      askForConfirmation={
        cron.isActive
          ? true
          : {
              title: t.cron.runCronIfNotActiveQuestion.title,
              description: t.cron.runCronIfNotActiveQuestion.description,
            }
      }
      action={async () => {
        'use server'
        return superAction(async () => {
          await throwIfNotAdmin({ allowDev: true })
          const url = `${BASE_URL}/${cron.url}`
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${process.env.CRON_SECRET}`,
              'x-vercel-protection-bypass':
                process.env.VERCEL_AUTOMATION_BYPASS_SECRET!,
            },
          })
          if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`)
          }
        })
      }}
    >
      {t.cron.runNow}
    </ActionButton>
  )
}

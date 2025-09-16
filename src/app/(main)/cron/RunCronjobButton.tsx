import { getTranslations } from '@/i18n/getTranslations'
import { BASE_URL } from '@/lib/config'
import { superAction } from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { Cron } from '@/super-cron/crons'

export const RunCronjobButton = async ({
  cron,
}: {
  cron: Pick<Cron, 'url'>
}) => {
  const t = await getTranslations()

  return (
    <ActionButton
      size="sm"
      catchToast
      action={async () => {
        'use server'
        return superAction(async () => {
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

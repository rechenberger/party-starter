import { Badge } from '@/components/ui/badge'
import { getTranslations } from '@/i18n/getTranslations'
import { getAllowlistCount } from '@/lib/email-allowlist'
import { shouldActuallySendEmails } from '@/lib/email-delivery'

export const EmailDeliveryBadge = async () => {
  const t = await getTranslations()
  const enabled = shouldActuallySendEmails()

  if (enabled) {
    return <Badge variant="default">{t.emailsLog.delivery.enabled}</Badge>
  }

  const allowlistCount = await getAllowlistCount()

  if (allowlistCount > 0) {
    return (
      <Badge className="bg-orange-500 text-white">
        {t.emailsLog.delivery.partiallyEnabled}
      </Badge>
    )
  }

  return <Badge variant="destructive">{t.emailsLog.delivery.disabled}</Badge>
}

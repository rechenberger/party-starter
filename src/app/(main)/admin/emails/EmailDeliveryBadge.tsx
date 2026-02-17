import { Badge } from '@/components/ui/badge'
import { getTranslations } from '@/i18n/getTranslations'
import { getAllowlistCount } from '@/lib/email-allowlist'
import { shouldActuallySendEmails } from '@/lib/email-delivery'
import Link from 'next/link'

export const EmailDeliveryBadge = async () => {
  const t = await getTranslations()
  const enabled = shouldActuallySendEmails()

  if (enabled) {
    return (
      <Link href="/admin/emails/settings">
        <Badge variant="default">{t.emailsLog.delivery.enabled}</Badge>
      </Link>
    )
  }

  const allowlistCount = await getAllowlistCount()

  if (allowlistCount > 0) {
    return (
      <Link href="/admin/emails/settings">
        <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
          {t.emailsLog.delivery.partiallyEnabled}
        </Badge>
      </Link>
    )
  }

  return (
    <Link href="/admin/emails/settings">
      <Badge variant="destructive">{t.emailsLog.delivery.disabled}</Badge>
    </Link>
  )
}

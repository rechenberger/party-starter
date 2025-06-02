import { getMyLocale } from '@/i18n/getMyLocale'
import { getTranslations } from '@/i18n/getTranslations'
import { getMailTransporter } from '@/lib/getMailTransporter'
import { BRAND } from '@/lib/starter.config'
import { OrgInvite } from '@emails/OrgInvite'
import { render } from '@react-email/components'

export const sendOrgInviteMail = async (params: {
  receiverEmail: string
  invitedByEmail: string
  invitedByUsername: string | null
  orgName: string
  inviteLink: string
  role: 'admin' | 'member'
}) => {
  const {
    receiverEmail,
    invitedByEmail,
    invitedByUsername,
    orgName,
    inviteLink,
    role,
  } = params
  try {
    const transporter = getMailTransporter()
    const locale = await getMyLocale()
    const t = await getTranslations(locale)

    const emailComponent = (
      <OrgInvite
        invitedByEmail={invitedByEmail}
        invitedByUsername={invitedByUsername}
        orgName={orgName}
        inviteLink={inviteLink}
        role={role}
        locale={locale}
      />
    )

    const [html, text] = await Promise.all([
      render(emailComponent),
      render(emailComponent, {
        plainText: true,
      }),
    ])

    const mailOptions = {
      to: receiverEmail,
      subject: t.email.orgInvite.subjectText(orgName, BRAND.name),
      html,
      text,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log({ error })
    throw error
  }
}

import { OrgInvite } from '@emails/OrgInvite'
import { render } from '@react-email/components'
import nodemailer from 'nodemailer'

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
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_URL,
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    })

    const emailHtml = await render(
      <OrgInvite
        invitedByEmail={invitedByEmail}
        invitedByUsername={invitedByUsername}
        orgName={orgName}
        inviteLink={inviteLink}
        role={role}
      />,
    )
    const emailPlainText = await render(
      <OrgInvite
        invitedByEmail={invitedByEmail}
        invitedByUsername={invitedByUsername}
        orgName={orgName}
        inviteLink={inviteLink}
        role={role}
      />,
      {
        plainText: true,
      },
    )

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: receiverEmail,
      subject: `Join ${orgName} on Party Starter`,
      html: emailHtml,
      text: emailPlainText,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log({ error })
  }
}

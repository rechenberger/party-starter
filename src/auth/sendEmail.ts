import { EmailTemplateOptions, emailTemplate } from './emailTemplate'

import nodemailer from 'nodemailer'

export const sendEmail = async (options: EmailTemplateOptions) => {
  try {
    const transporter = nodemailer.createTransport(process.env.SMTP_URL)

    const mail = emailTemplate(options)

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log({ error })
  }
}

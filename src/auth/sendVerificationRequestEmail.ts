import {
  getDefaultSignInEmailHtml,
  getDefaultSignInEmailText,
} from './defaultLoginEmail'

import nodemailer from 'nodemailer'

export const sendVerificationRequestEmail = async (options: {
  email: string
  url: string
}) => {
  const { email, url } = options
  try {
    const transporter = nodemailer.createTransport(process.env.SMTP_URL)
    const host = new URL(url).host

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Login to ${host}`,
      html: getDefaultSignInEmailHtml({ url }),
      text: getDefaultSignInEmailText({ url }),
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.log({ error })
  }
}

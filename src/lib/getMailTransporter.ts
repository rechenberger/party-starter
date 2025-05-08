import nodemailer from 'nodemailer'
export const getMailTransporter = () => {
  if (
    !process.env.SMTP_URL ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error('SMTP_URL, SMTP_USER and SMTP_PASSWORD must be set')
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_URL,
    port: 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  return transporter
}

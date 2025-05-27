import nodemailer from 'nodemailer'
export const getMailTransporter = () => {
  if (!process.env.SMTP_URL) {
    throw new Error('SMTP_URL must be set')
  }
  const transporter = nodemailer.createTransport(process.env.SMTP_URL, {
    from: process.env.EMAIL_FROM,
  })

  return transporter
}

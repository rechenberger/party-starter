import nodemailer from 'nodemailer'
export const getMailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_URL,
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  })

  return transporter
}

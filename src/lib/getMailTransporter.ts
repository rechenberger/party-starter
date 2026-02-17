import nodemailer from 'nodemailer'
import { getEmailFromAddress, getEmailServerConfig } from './email-delivery'

export const getMailTransporter = () => {
  const transporter = nodemailer.createTransport(getEmailServerConfig(), {
    from: getEmailFromAddress(),
  })

  return transporter
}

import 'server-only'

export const BASE_URL = process.env.BASE_URL
  ? process.env.BASE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

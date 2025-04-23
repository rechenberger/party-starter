import { Client, neon, neonConfig } from '@neondatabase/serverless'
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http'
import { drizzle as drizzleServerless } from 'drizzle-orm/neon-serverless'
import ws from 'ws'
import { schema } from './schema-export'

neonConfig.webSocketConstructor = ws

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzleHttp(sql, {
  schema,
})

export const createClient = async () => {
  const client = new Client(process.env.DATABASE_URL!)
  await client.connect()
  return { db: drizzleServerless(client, { schema }), client }
}

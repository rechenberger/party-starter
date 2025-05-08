import { sql } from 'drizzle-orm'
import { text, timestamp } from 'drizzle-orm/pg-core'
import { createId } from './createId'

export const idColumn = () =>
  text('id').notNull().primaryKey().$default(createId)

export const createdAtColumn = () =>
  timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()

export const updatedAtColumn = () =>
  timestamp('updatedAt')
    .notNull()
    .$onUpdate(() => new Date())

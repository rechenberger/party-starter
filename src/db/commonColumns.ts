import { sql } from 'drizzle-orm'
import { text, timestamp } from 'drizzle-orm/pg-core'
import { createId } from './createId'
import { users } from './schema-auth'

export const idColumn = () =>
  text('id').notNull().primaryKey().$default(createId)

export const createdAtColumn = () =>
  timestamp('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()

export const updatedAtColumn = () =>
  timestamp('updatedAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => new Date())

export const createdUpdatedAtColumns = () => ({
  createdAt: createdAtColumn(),
  updatedAt: updatedAtColumn(),
})

export const createdByIdColumn = () =>
  text('createdById').references(() => users.id, {
    onDelete: 'set null',
  })

export const updatedByIdColumn = () =>
  text('updatedById').references(() => users.id, {
    onDelete: 'set null',
  })

export const createdUpdateByColumns = () => ({
  createdById: createdByIdColumn(),
  updatedById: updatedByIdColumn(),
})

export const createdUpdatedAtByColumns = () => ({
  ...createdUpdatedAtColumns(),
  ...createdUpdateByColumns(),
})

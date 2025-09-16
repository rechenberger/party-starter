import { customType } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const zodEnumToCustomType = <Schema extends z.Schema>(
  schema: Schema,
) => {
  return customType<{
    data: z.infer<Schema>
    driverData: string
  }>({
    dataType() {
      return 'text'
    },
    toDriver(value: z.infer<Schema>): string {
      return schema.parse(value)
    },
    fromDriver(value: string): z.infer<Schema> {
      return schema.parse(value)
    },
  })
}

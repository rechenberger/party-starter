import { cn } from '@/lib/utils'
import { z } from 'zod'
import { createAiComponent } from './createAiComponent'

export const AiList = createAiComponent({
  schema: z.object({ list: z.array(z.string()) }),
  render: async ({ data, done }) => {
    return (
      <>
        <ul className={cn('list-disc list-inside', !done && 'animate-pulse')}>
          {data?.list?.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </>
    )
  },
})

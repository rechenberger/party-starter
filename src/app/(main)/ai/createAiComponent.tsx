import { createOpenAI } from '@ai-sdk/openai'
import { DeepPartial, experimental_streamObject } from 'ai'
import { createStreamableUI } from 'ai/rsc'
import { ReactNode } from 'react'
import { z } from 'zod'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
})

export const createAiComponent = <T,>({
  schema,
  render,
}: {
  schema: z.ZodType<T>
  render: (props: {
    data?: DeepPartial<T>
    done: boolean
  }) => ReactNode | Promise<ReactNode>
}) => {
  const Comp = async ({ prompt }: { prompt: string }) => {
    const { partialObjectStream } = await experimental_streamObject({
      model: openai.chat('gpt-3.5-turbo'),
      prompt,
      schema,
    })

    const ui = createStreamableUI(await render({ done: false }))

    const stream = async () => {
      let lastObj
      for await (const obj of partialObjectStream) {
        lastObj = obj
        ui.update(await render({ data: obj, done: false }))
      }
      ui.done(
        await render({
          data: lastObj,
          done: true,
        }),
      )
    }
    stream()

    return ui.value
  }

  return Comp
}

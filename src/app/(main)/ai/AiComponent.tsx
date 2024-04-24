import { createOpenAI } from '@ai-sdk/openai'
import { experimental_streamObject } from 'ai'
import { createStreamableUI } from 'ai/rsc'
import { ReactNode } from 'react'
import { DeepPartial } from 'react-hook-form'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
})

export const AiComponent = async <T,>({
  render,
  model = openai.chat('gpt-3.5-turbo'),
  ...props
}: {
  render: (props: {
    data?: DeepPartial<T>
    done: boolean
  }) => ReactNode | Promise<ReactNode>
  model?: Parameters<typeof experimental_streamObject<T>>[0]['model']
} & Omit<Parameters<typeof experimental_streamObject<T>>[0], 'model'>) => {
  const { partialObjectStream } = await experimental_streamObject({
    model,
    ...props,
  })

  const ui = createStreamableUI(await render({ done: false }))

  const stream = async () => {
    let lastObj
    for await (const obj of partialObjectStream) {
      lastObj = obj
      ui.update(await render({ data: obj as any, done: false }))
    }
    ui.done(
      await render({
        data: lastObj as any,
        done: true,
      }),
    )
  }
  stream()

  return ui.value
}

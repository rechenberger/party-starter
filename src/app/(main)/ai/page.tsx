// const Text = createAiComponent()

import { AiList } from './AiList'

export default async function Page() {
  return (
    <>
      <h1>AI</h1>
      <AiList prompt="top 3 programming languages" />
    </>
  )
}

import { ClientComp } from './ClientComp'
import { createSuperState, toPublicState } from './createSuperState'

export default function Page() {
  const superState = createSuperState({
    publicState: {
      name: 'John Doe',
    },
    secretState: {
      id: Math.random().toString(),
    },
  })

  return (
    <>
      <div>Dev</div>
      <ClientComp superState={toPublicState(superState)} />
    </>
  )
}

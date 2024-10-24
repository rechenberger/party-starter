import { SimpleDataCard } from '@/components/simple/SimpleDataCard'
import { streamKv, superAction } from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { SuperState } from './SuperState'

const MyComp = async ({ state, kvKey }: { state: any; kvKey: string }) => {
  'use server'
  return (
    <div>
      <h1>My Comp</h1>
      <SimpleDataCard data={state} />
      <ActionButton
        action={async () => {
          'use server'
          return superAction(async () => {
            streamKv({
              key: kvKey,
              value: (
                <MyComp
                  state={{
                    ...state,
                    name: state.name + '!',
                  }}
                  kvKey={kvKey}
                />
              ),
            })
          })
        }}
      >
        Update
      </ActionButton>
    </div>
  )
}

export default function Page() {
  return (
    <>
      <SuperState initialState={{ name: 'Max' }} comp={MyComp} />
    </>
  )
}

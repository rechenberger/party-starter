import { SimpleDataCard } from '@/components/simple/SimpleDataCard'
import { superAction } from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { SuperState } from './SuperState'

export default function Page() {
  return (
    <>
      <SuperState
        initialState={{ name: 'Max' }}
        comp={async ({ state, update }) => {
          'use server'
          return (
            <div>
              <h1>My Comp</h1>
              <SimpleDataCard data={state} />
              <ActionButton
                action={async () => {
                  'use server'
                  return superAction(async () => {
                    return update({ name: state.name + '!' })
                  })
                }}
              >
                Update
              </ActionButton>
            </div>
          )
        }}
      />
    </>
  )
}

import { streamKv } from '@/super-action/action/createSuperAction'
import { ReactNode } from 'react'
import { SuperStateClient } from './SuperStateClient'

type SuperStateCompProps<State> = {
  state: State
  update: (newState: State) => void
}

type SuperStateProps<State> = {
  initialState: State
  comp: (props: SuperStateCompProps<State>) => ReactNode
}

export const SuperState = <State,>(props: SuperStateProps<State>) => {
  const kvKey = 'abc'

  const update = async (newState: State) => {
    'use server'

    streamKv({
      key: kvKey,
      value: <props.comp state={newState} update={update} />,
    })
  }

  return (
    <SuperStateClient
      kvKey={kvKey}
      fallback={<props.comp state={props.initialState} update={update} />}
    />
  )
}

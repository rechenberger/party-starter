'use client'

import { ClientToServerComp } from './ClientToServerComp'
import { Readme } from './Readme'

export const ClientComp = () => {
  return (
    <>
      This is a client component
      <ClientToServerComp action={Readme} className="bg-green-500/20" />
    </>
  )
}

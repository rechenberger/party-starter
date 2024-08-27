'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

export const ClientToServerComp = <Props,>({
  action,
  ...props
}: {
  action: (props: Props) => Promise<ReactNode>
} & Props) => {
  const ref = useRef(false)
  const [state, setState] = useState<ReactNode | null>(null)
  useEffect(() => {
    if (ref.current) return
    ref.current = true
    action(props as any).then(setState)
  }, [action, props])
  return state
}

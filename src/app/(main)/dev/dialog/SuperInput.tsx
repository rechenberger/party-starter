'use client'

import { Input } from '@/components/ui/input'
import { SuperActionWithInput } from '@/super-action/action/createSuperAction'
import { useSuperAction } from '@/super-action/action/useSuperAction'
import { debounce } from 'lodash-es'
import { useMemo } from 'react'

export const SuperInput = ({
  defaultValue,
  action,
}: {
  defaultValue: string
  action: SuperActionWithInput<string>
}) => {
  const { trigger } = useSuperAction({
    action,
  })

  const debouncedTrigger = useMemo(() => debounce(trigger, 200), [trigger])
  return (
    <Input
      defaultValue={defaultValue}
      onChange={(evt) => debouncedTrigger(evt.target.value)}
    />
  )
}

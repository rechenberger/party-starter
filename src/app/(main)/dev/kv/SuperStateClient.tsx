'use client'

import { superActionKvAtom } from '@/super-action/action/superActionKvAtom'
import { useAtomValue } from 'jotai'
import { ReactNode } from 'react'

export const SuperStateClient = ({
  kvKey,
  fallback,
}: {
  kvKey: string
  fallback?: ReactNode
}) => {
  const kv = useAtomValue(superActionKvAtom)
  const state = kv[kvKey]
  return state ?? fallback
}

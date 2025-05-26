'use client'

import { toast } from '@/components/ui/use-toast'
import { useTranslations } from '@/i18n/useTranslations'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useShowDialog } from '../dialog/DialogProvider'
import { consumeSuperActionResponse } from './consumeSuperActionResponse'
import { SuperAction, SuperActionDialog } from './createSuperAction'

export type UseSuperActionOptions<Result, Input> = {
  action: SuperAction<Result, Input>
  disabled?: boolean
  catchToast?: boolean
  askForConfirmation?: boolean | SuperActionDialog
  stopPropagation?: boolean
}

export const useSuperAction = <Result = undefined, Input = undefined>(
  options: UseSuperActionOptions<Result, Input>,
) => {
  const [isLoading, setIsLoading] = useState(false)

  const { action, disabled, catchToast, askForConfirmation, stopPropagation } =
    options

  const router = useRouter()
  const showDialog = useShowDialog()
  const t = useTranslations()

  const trigger = useCallback(
    async (input: Input, evt?: MouseEvent) => {
      if (isLoading) return
      if (disabled) return
      if (stopPropagation) {
        evt?.stopPropagation()
        evt?.preventDefault()
      }
      if (askForConfirmation) {
        const dialogOptions =
          typeof askForConfirmation === 'object' ? askForConfirmation : {}
        const res = await showDialog({
          title: t.standardWords.areYouSure,
          confirm: t.standardWords.yes,
          cancel: t.standardWords.cancel,
          ...dialogOptions,
        })
        if (!res) return
      }
      setIsLoading(true)

      const response = await action(input).catch((e) => {
        setIsLoading(false)
        throw e
      })

      if (response && 'superAction' in response) {
        const result = await consumeSuperActionResponse({
          response: Promise.resolve(response.superAction),
          onToast: (t) => {
            toast({
              title: t.title,
              description: t.description,
            })
          },
          onDialog: (d) => {
            showDialog(d)
          },
          onRedirect: (r) => {
            if (r.type === 'push') {
              router.push(r.url)
            } else {
              router.replace(r.url)
            }
          },
          catch: catchToast
            ? (e) => {
                toast({
                  variant: 'destructive',
                  title: e.message,
                })
              }
            : undefined,
        })

        setIsLoading(false)
        return result
      }

      setIsLoading(false)
    },
    [
      isLoading,
      disabled,
      stopPropagation,
      askForConfirmation,
      action,
      showDialog,
      catchToast,
      router,
    ],
  )

  return {
    trigger,
    isLoading,
  }
}

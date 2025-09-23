'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useTranslations } from '@/i18n/useTranslations'
import { AlertCircle } from 'lucide-react'

export const ErrorPage = ({ error }: { error: Error }) => {
  const t = useTranslations()
  return (
    <Alert variant="default" className="container max-w-lg">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{t.standardWords.error}</AlertTitle>
      <AlertDescription>
        {error.message || t.standardWords.anErrorOccurred}
      </AlertDescription>
    </Alert>
  )
}

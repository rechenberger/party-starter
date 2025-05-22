'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export const ErrorPage = ({ error }: { error: Error }) => {
  return (
    <Alert variant="default" className="container max-w-lg">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message || 'An error occurred.'}
      </AlertDescription>
    </Alert>
  )
}

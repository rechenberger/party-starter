'use client'

import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { useToast } from './ui/use-toast'

export const CopyToClipboardButton = ({
  textToCopy,
  textToDisplay,
  ...buttonProps
}: {
  textToCopy: string
  textToDisplay?: string
} & React.ComponentProps<typeof Button>) => {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1500)
    toast({
      title: 'Copied to clipboard',
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Copy to clipboard"
      {...buttonProps}
      onClick={handleCopy}
    >
      {textToDisplay ? textToDisplay : ''}
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="sr-only">Copy to clipboard</span>
    </Button>
  )
}

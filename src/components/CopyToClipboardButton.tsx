'use client'

import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export const CopyToClipboardButton = ({
  text,
  ...buttonProps
}: {
  text: string
} & React.ComponentProps<typeof Button>) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1500)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      title="Copy to clipboard"
      {...buttonProps}
      onClick={handleCopy}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="sr-only">Copy to clipboard</span>
    </Button>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from '@/i18n/useTranslations'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const CopyToClipboardButton = ({
  textToCopy,
  textToDisplay,
  ...buttonProps
}: {
  textToCopy: string
  textToDisplay?: string
} & React.ComponentProps<typeof Button>) => {
  const [isCopied, setIsCopied] = useState(false)
  const t = useTranslations()

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1500)
    toast(t.standardWords.copiedToClipboard)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      title={t.standardWords.copyToClipboard}
      {...buttonProps}
      onClick={handleCopy}
    >
      {textToDisplay ? textToDisplay : ''}
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      <span className="sr-only">{t.standardWords.copyToClipboard}</span>
    </Button>
  )
}

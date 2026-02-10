import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

export const Markdown = ({
  children,
  className,
}: {
  children: string | undefined | null
  className?: string
}) => {
  return (
    <div className={cn('prose dark:prose-invert', className)}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  )
}

'use server'

import { Markdown } from '@/components/demo/Markdown'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { promises as fs } from 'fs'
import path from 'path'

export const Readme = async ({ className }: { className?: string }) => {
  const p = path.join(process.cwd(), '/README.md')
  const readme = await fs.readFile(p, 'utf8')
  return (
    <>
      <Card className={cn('max-w-full py-8', className)}>
        <CardContent>
          <Markdown className="break-words">{readme}</Markdown>
        </CardContent>
      </Card>
    </>
  )
}

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getMyLocale } from '@/i18n/getMyLocale'
import { ParamsWrapper } from '@/lib/paramsServerContext'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default ParamsWrapper(async () => {
  const locale = await getMyLocale()
  return (
    <>
      <Card className="self-center w-full max-w-md flex flex-col gap-4">
        <CardHeader>
          <CardTitle>Check your emails</CardTitle>
          <CardDescription>
            We have sent you an email to verify your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href={`/${locale}`}>
            <Button variant="default">
              <ArrowLeft className="size-4" /> Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </>
  )
})

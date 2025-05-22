import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function Page() {
  return (
    <>
      <Card className="self-center w-full max-w-md flex flex-col gap-4">
        <CardHeader>
          <CardTitle>Check your emails</CardTitle>
          <CardDescription>
            We have sent you an email to verify your email address.
            <br />
            You can close this browser window now.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href={`/`} prefetch={false}>
            <Button variant="default">
              <ArrowLeft className="size-4" /> Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </>
  )
}

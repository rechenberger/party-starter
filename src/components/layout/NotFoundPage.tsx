import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { House, Squirrel } from 'lucide-react'
import Link from 'next/link'

export const NotFoundPage = async () => {
  // const locale = await getMyLocale()

  return (
    <MainTopLayout>
      <div className=" flex items-center justify-center">
        <Card className="self-center w-full max-w-md flex flex-col gap-4">
          <CardHeader className="text-center">
            <CardTitle className="flex gap-2 justify-center items-center">
              Page not found <Squirrel className="size-5" />
            </CardTitle>
            <CardDescription>
              The page you are looking for does not exist.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-row gap-4 flex-1 justify-center">
            <Link href={`/`} prefetch={false}>
              <Button variant="default" className="w-full">
                <House className="size-4" /> Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MainTopLayout>
  )
}

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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
      </Card>
    </>
  )
}

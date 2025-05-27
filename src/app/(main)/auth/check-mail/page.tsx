import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getTranslations } from '@/i18n/getTranslations'

export default async function Page() {
  const t = await getTranslations()
  return (
    <>
      <Card className="self-center w-full max-w-md flex flex-col gap-4">
        <CardHeader>
          <CardTitle>{t.auth.checkMailTitle}</CardTitle>
          <CardDescription>{t.auth.checkMailDescription}</CardDescription>
        </CardHeader>
      </Card>
    </>
  )
}

import { TopHeader } from '@/components/TopHeader'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getTranslations } from '@/i18n/getTranslations'
import { crons } from '@/super-cron/crons'
import { BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { RunCronjobButton } from './RunCronjobButton'

export default async function Page() {
  const t = await getTranslations()
  return (
    <>
      <TopHeader>{t.nav.crons}</TopHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {crons.map((cron) => (
          <Card key={cron.name} className="w-full">
            <CardHeader className="flex-1 flex flex-col gap-2">
              <CardTitle>{cron.name}</CardTitle>
              <CardDescription className="whitespace-pre-wrap flex flex-col gap-2">
                <div>{cron.description}</div>
                <div className="text-xs text-muted-foreground font-mono">
                  <p>
                    Schedule:{' '}
                    <a
                      className="hover:underline"
                      href={`https://crontab.guru/#${cron.schedule.replace(
                        /\s+/g,
                        '_',
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cron.schedule}
                    </a>
                  </p>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row gap-2 justify-end">
              <RunCronjobButton cron={cron} />
              <Button size="sm" variant="outline" asChild>
                <Link href={`/cron/${encodeURIComponent(cron.name)}`}>
                  <BarChart3 className="size-4" />
                  View Runs
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

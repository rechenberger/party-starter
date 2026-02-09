import { Readme } from '@/components/demo/Readme'
import { Button } from '@/components/ui/button'
import { getTranslations } from '@/i18n/getTranslations'
import { Locale } from '@/i18n/locale'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export const StartPage = async ({ locale }: { locale: Locale }) => {
  const t = await getTranslations({ locale })
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center gap-12 py-8">
        <h1 className="text-2xl lg:text-6xl">🎉 {t.landing.title} 🥳</h1>
        <div className="flex flex-col gap-2">
          <Link
            href="https://github.com/new?template_name=party-starter&template_owner=rechenberger"
            target="_blank"
          >
            <Button variant={'outline'}>
              Use this template
              <ExternalLink className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <Suspense>
          <Readme />
        </Suspense>
      </div>
    </>
  )
}

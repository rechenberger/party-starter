import { MainTopLayout } from '@/components/layout/MainTopLayout'
import { localeDefinitions, LOCALES } from '@/i18n/locale'
import { ParamsWrapper } from '@/lib/paramsServerContext'
import { keyBy, mapValues } from 'lodash-es'
import type { Metadata } from 'next'

export const generateStaticParams = async () => {
  return LOCALES.map((locale) => ({
    locale,
  }))
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const localeFromParams = (await params).locale
  return {
    alternates: {
      canonical: `./`,
      languages: mapValues(
        keyBy(
          localeDefinitions.filter(
            (locale) => locale.locale !== localeFromParams,
          ),
          'locale',
        ),
        (locale) => `${locale.locale}`,
      ),
    },
  } satisfies Metadata
}

export default ParamsWrapper(
  async ({ children }: { children: React.ReactNode }) => {
    return <MainTopLayout>{children}</MainTopLayout>
  },
)

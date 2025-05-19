import { Locale, localeDefinitions } from '@/i18n/locale'
import { keyBy, mapValues, replace } from 'lodash-es'
import { type Metadata, type ResolvingMetadata } from 'next'

// PUT THIS IN LAYOUT
export const generateMetadataLocalizedLayout = () => {
  return async ({ params }: { params: Promise<{ locale: string }> }) => {
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
}

// TO MAKE THIS WORK
export const generateMetadataLocalizedAlternates = async ({
  params,
  parent,
}: {
  params: Promise<{ locale: string }>
  parent: ResolvingMetadata
}) => {
  const currentLocale = (await params).locale
  const parentMetadata = await parent
  const canonical =
    parentMetadata['alternates']?.canonical?.url.toString() ?? ''
  const otherLocales = localeDefinitions.filter(
    (def) => def.locale !== currentLocale,
  )

  const languages = mapValues(keyBy(otherLocales, 'locale'), (locale) =>
    replace(canonical, currentLocale, locale.locale),
  )

  const alternates: Metadata['alternates'] = {
    canonical,
    languages,
  }

  return alternates
}

// HELPER FUNCTION FOR PREMIUM DX
export const generateMetadataLocalized = <
  PageProps extends { params: Promise<{ locale: string }> },
>(
  cb?: (
    options: PageProps & {
      parent: ResolvingMetadata
      locale: Locale
    },
  ) => Promise<Metadata> | Metadata,
) => {
  return async (props: PageProps, parent: ResolvingMetadata) => {
    const locale = Locale.parse((await props.params).locale)
    const metadata = cb ? await cb({ ...props, locale, parent }) : {}
    return {
      alternates: await generateMetadataLocalizedAlternates({
        params: props.params,
        parent,
      }),
      ...metadata,
    } satisfies Metadata
  }
}

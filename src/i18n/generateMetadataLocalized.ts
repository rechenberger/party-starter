import { Locale, localeDefinitions } from '@/i18n/locale'
import { keyBy, mapValues, replace } from 'lodash-es'
import { type Metadata, type ResolvingMetadata } from 'next'

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

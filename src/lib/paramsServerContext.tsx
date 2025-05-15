import { getMyLocale } from '@/i18n/getMyLocale'
import { LocaleProvider } from '@/i18n/LocaleContext'
import { createServerContext } from '@sodefa/next-server-context'
import { setDefaultOptions } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import { ReactNode } from 'react'
import { z } from 'zod'

export const paramsContext = createServerContext<
  Promise<{
    orgSlug?: string
    locale?: string
  }>
>()

export const ParamsWrapper = <ComponentProps,>(
  Component: (props: ComponentProps) => ReactNode,
) => {
  const WrapperPage = async (props: ComponentProps) => {
    const parsedProps = z
      .object({
        params: z.promise(
          z.object({
            orgSlug: z.string().optional(),
            locale: z.string().optional(),
          }),
        ),
      })
      .parse(props)
    paramsContext.set(parsedProps.params)
    const locale = await getMyLocale()

    setDefaultOptions({
      locale: locale === 'en' ? enUS : de,
    })
    return (
      <LocaleProvider value={locale}>
        <Component {...(props as any)} />
      </LocaleProvider>
    )
  }
  return WrapperPage
}

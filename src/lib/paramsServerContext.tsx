import { createServerContext } from '@sodefa/next-server-context'
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
  const WrapperPage = (props: ComponentProps) => {
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
    return <Component {...(props as any)} />
  }
  return WrapperPage
}

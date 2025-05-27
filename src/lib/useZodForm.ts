import { useZodTranslations } from '@/i18n/useZodTranslations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormContext, type UseFormProps } from 'react-hook-form'
import { type ZodType } from 'zod'
import { useZodErrorMapTranslated } from './useZodErrorMapTranslated'

export const useZodForm = <TSchema extends ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema
  },
) => {
  const t = useZodTranslations()
  const errorMap = useZodErrorMapTranslated(t)
  const form = useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, {
      errorMap: errorMap,
    }),
  })

  return form
}

export const createZodForm = <TSchema extends ZodType>(schema: TSchema) => {
  const useCreatedZodForm = (
    props?: Omit<UseFormProps<TSchema['_input']>, 'resolver'>,
  ) => {
    const form = useZodForm({
      ...props,
      schema,
    })

    return form
  }

  const useZodFormContext = () => {
    const form = useFormContext<TSchema['_input']>()

    return form
  }

  return [useCreatedZodForm, useZodFormContext] as const
}

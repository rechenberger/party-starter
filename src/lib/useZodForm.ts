import { useZodTranslations } from '@/i18n/useZodTranslations'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type FieldValues,
  useForm,
  useFormContext,
  type UseFormProps,
} from 'react-hook-form'
import { z, type ZodType } from 'zod'
import { useZodErrorMapTranslated } from './useZodErrorMapTranslated'

type ZodFormValues<TSchema extends ZodType> = z.output<TSchema> & FieldValues

export const useZodForm = <TSchema extends ZodType>(
  props: Omit<UseFormProps<ZodFormValues<TSchema>>, 'resolver'> & {
    schema: TSchema
  },
) => {
  const t = useZodTranslations()
  const errorMap = useZodErrorMapTranslated(t)

  const resolver = (zodResolver as any)(props.schema, {
    error: errorMap as any,
  }) as any

  const form = useForm<ZodFormValues<TSchema>>({
    ...props,
    resolver,
  })

  return form
}

export const createZodForm = <TSchema extends ZodType>(schema: TSchema) => {
  const useCreatedZodForm = (
    props?: Omit<UseFormProps<ZodFormValues<TSchema>>, 'resolver'>,
  ) => {
    const form = useZodForm({
      ...props,
      schema,
    })

    return form
  }

  const useZodFormContext = () => {
    const form = useFormContext<ZodFormValues<TSchema>>()

    return form
  }

  return [useCreatedZodForm, useZodFormContext] as const
}

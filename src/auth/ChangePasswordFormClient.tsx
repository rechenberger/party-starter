'use client'

import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useTranslations } from '@/i18n/useTranslations'
import { createZodForm } from '@/lib/useZodForm'
import { SuperActionWithInput } from '@/super-action/action/createSuperAction'
import { useSuperAction } from '@/super-action/action/useSuperAction'
import Link from 'next/link'
import { z } from 'zod'

const ChangePasswordSchema = z
  .object({
    password: z.string().min(1),
    confirmPassword: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        params: {
          i18n: {
            key: 'auth.confirmPasswordMismatch',
          },
        },
      })
    }
  })

type ChangePasswordSchema = z.infer<typeof ChangePasswordSchema>

const [useLoginForm] = createZodForm(ChangePasswordSchema)

export const ChangePasswordFormClient = ({
  action,
  email,
  redirectUrl,
}: {
  action: SuperActionWithInput<ChangePasswordSchema>
  email?: string
  redirectUrl?: string
}) => {
  const { trigger, isLoading } = useSuperAction({
    action,
    catchToast: true,
  })

  const disabled = isLoading

  const form = useLoginForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    disabled,
  })
  const t = useTranslations()

  return (
    <>
      <div className="mb-2">
        <CardTitle>{t.userManagement.changePasswordTitle}</CardTitle>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            await trigger(values)
          })}
          className="flex flex-col gap-4"
        >
          {!!email && (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  name="email"
                  autoComplete="username"
                  type="email"
                  disabled
                  value={email}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.standardWords.password}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.standardWords.confirmPassword}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2 mt-4 justify-end">
            {!!redirectUrl && (
              <Link href={redirectUrl} passHref>
                <Button variant={'outline'} type="button" disabled={disabled}>
                  {t.standardWords.skip}
                </Button>
              </Link>
            )}
            <Button type="submit" disabled={disabled}>
              {t.userManagement.changePasswordAction}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

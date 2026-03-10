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
import { api } from '../../convex/_generated/api'
import { useMutation } from 'convex/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { authClient } from './auth-client'

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
  email,
  redirectUrl,
}: {
  email?: string
  redirectUrl?: string
}) => {
  const router = useRouter()
  const t = useTranslations()
  const session = authClient.useSession()
  const setPassword = useMutation(api.users.setOwnPassword)

  const form = useLoginForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    disabled: session.isPending,
  })

  return (
    <>
      <div className="mb-2">
        <CardTitle>{t.userManagement.changePasswordTitle}</CardTitle>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            await setPassword({ newPassword: values.password })
            router.push(redirectUrl ?? '/app')
            router.refresh()
          })}
          className="flex flex-col gap-4"
        >
          {!!email && (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  data-testid="change-password-email"
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
                    data-testid="change-password-input"
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
                    data-testid="change-password-confirm"
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
                <Button
                  variant="outline"
                  type="button"
                  disabled={session.isPending}
                >
                  {t.standardWords.skip}
                </Button>
              </Link>
            )}
            <Button
              data-testid="change-password-submit"
              type="submit"
              disabled={session.isPending}
            >
              {t.userManagement.changePasswordAction}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

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
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { authClient } from './auth-client'

const ChangeUsernameSchema = z.object({
  username: z.string().min(1),
})

type ChangeUsernameSchema = z.infer<typeof ChangeUsernameSchema>

const [useLoginForm] = createZodForm(ChangeUsernameSchema)

export const ChangeUsernameFormClient = ({
  username,
  redirectUrl,
}: {
  username?: string
  redirectUrl?: string
}) => {
  const router = useRouter()
  const t = useTranslations()
  const session = authClient.useSession()

  const form = useLoginForm({
    defaultValues: {
      username: username ?? '',
    },
    disabled: session.isPending,
  })

  return (
    <>
      <div className="mb-2">
        <CardTitle>{t.userManagement.changeUsernameTitle}</CardTitle>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            const result = await authClient.updateUser({
              name: values.username,
            })
            if (result.error) {
              throw new Error(
                result.error.message || 'Failed to update username',
              )
            }
            router.push(redirectUrl ?? '/app')
            router.refresh()
          })}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.standardWords.username}</FormLabel>
                <FormControl>
                  <Input data-testid="change-username-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2 mt-4 justify-end">
            <Button
              data-testid="change-username-submit"
              type="submit"
              disabled={session.isPending}
            >
              {t.userManagement.changeUsernameAction}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}

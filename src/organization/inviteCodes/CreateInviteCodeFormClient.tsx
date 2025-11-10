'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useTranslations } from '@/i18n/useTranslations'
import { createZodForm } from '@/lib/useZodForm'
import { SuperActionPromise } from '@/super-action/action/createSuperAction'
import { useSuperAction } from '@/super-action/action/useSuperAction'
import { useShowDialog } from '@/super-action/dialog/DialogProvider'
import { z } from 'zod'
import { organizationRoleDefinitions } from '../organizationRoles'
import { ExpirationTime, expirationTimesDefinitions } from './expirationTimes'

const CreateInviteCodeSchema = z.object({
  role: z.enum(['admin', 'member']),
  expiresAt: ExpirationTime,
  usesMax: z.coerce.number().optional(),
  comment: z.string().optional(),
})

type CreateInviteCodeData = z.infer<typeof CreateInviteCodeSchema>

const [useCreateInviteCodeForm] = createZodForm(CreateInviteCodeSchema)

export const CreateInviteCodeFormClient = ({
  action,
  organizationSlug,
}: {
  organizationSlug: string
  action: (
    data: CreateInviteCodeData,
  ) => SuperActionPromise<{ id?: string; url?: string }, CreateInviteCodeData>
}) => {
  const { trigger, isLoading } = useSuperAction({
    action,
    catchToast: true,
  })
  const t = useTranslations()

  const showDialog = useShowDialog()
  const { toast } = useToast()
  const disabled = isLoading

  const form = useCreateInviteCodeForm({
    defaultValues: {
      role: 'member',
      expiresAt: '1d',
      usesMax: 1,
      comment: '',
    },
    disabled,
  })

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (formData) => {
            const result = await trigger(formData)
            if (result?.url) {
              navigator.clipboard.writeText(result.url)
              showDialog(null)
              toast({
                title: t.inviteCodes.createForm.success,
              })
            }
          })}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.inviteCodes.createForm.role}</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    name="role"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t.inviteCodes.createForm.selectRole}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationRoleDefinitions.map((role) => (
                        <SelectItem key={role.name} value={role.name}>
                          {t.roles[role.i18nKey]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.inviteCodes.createForm.expiresAt}</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    name="expiresAt"
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t.inviteCodes.createForm.selectExpiresAt}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {expirationTimesDefinitions.map((expirationTime) => (
                        <SelectItem
                          key={expirationTime.value}
                          value={expirationTime.value}
                        >
                          {t.expirationTimes[expirationTime.i18nKey]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="usesMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.inviteCodes.createForm.usesMax}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder={t.inviteCodes.createForm.usesMaxPlaceholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.inviteCodes.createForm.comment}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder={t.inviteCodes.createForm.commentPlaceholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2" disabled={disabled}>
            {t.inviteCodes.createForm.create}
          </Button>
        </form>
      </Form>
    </>
  )
}

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
import { InputWithButton } from '@/components/ui/input-with-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslations } from '@/i18n/useTranslations'
import { createZodForm } from '@/lib/useZodForm'
import { SuperActionPromise } from '@/super-action/action/createSuperAction'
import { useSuperAction } from '@/super-action/action/useSuperAction'
import { map, uniq } from 'lodash-es'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
import { organizationRoleDefinitions } from '../organizationRoles'

const CreateInviteCodeEmailSchema = z.object({
  role: z.enum(['admin', 'member']),
  receiverEmail: z.array(z.string().email()).min(1),
})

export type CreateInviteCodeEmailData = z.infer<
  typeof CreateInviteCodeEmailSchema
>

const [useCreateInviteCodeEmailForm] = createZodForm(
  CreateInviteCodeEmailSchema,
)

export const CreateInviteCodeEmailFormClient = ({
  action,
}: {
  action: (
    data: CreateInviteCodeEmailData,
  ) => SuperActionPromise<void, CreateInviteCodeEmailData>
}) => {
  const { trigger, isLoading } = useSuperAction({
    action,
    catchToast: true,
  })

  const t = useTranslations()

  const form = useCreateInviteCodeEmailForm({
    defaultValues: {
      role: 'member',
      receiverEmail: [],
    },
    disabled: isLoading,
  })

  const [receiverEmail, setReceiverEmail] = useState('')

  const handleAddReceiverEmail = (currentValue: string[]) => {
    if (receiverEmail) {
      form.setValue('receiverEmail', uniq([...currentValue, receiverEmail]))
      setReceiverEmail('')
      form.trigger('receiverEmail')
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!!receiverEmail) {
              handleAddReceiverEmail(form.getValues('receiverEmail'))
            }
            form.handleSubmit(async (formData) => {
              await trigger(formData)
            })()
          }}
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
                      {map(organizationRoleDefinitions, (role) => (
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
          <FormItem>
            <FormLabel>{t.inviteCodes.createForm.receiver}</FormLabel>
            <div className="flex flex-col gap-2">
              <InputWithButton
                inputProps={{
                  type: 'email',
                  autoComplete: 'email',
                  autoFocus: true,
                  className: 'flex-1',
                  placeholder: `someone@example.com`,
                  value: receiverEmail,
                  onChange: (e) => setReceiverEmail(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddReceiverEmail(form.getValues('receiverEmail'))
                    }
                  },
                }}
                buttonProps={{
                  onClick: () => {
                    handleAddReceiverEmail(form.getValues('receiverEmail'))
                  },
                  type: 'button',
                }}
                icon={<Plus className="h-4 w-4" />}
              />
              <div className="flex flex-wrap gap-2">
                {form.getValues('receiverEmail').map((mail, i) => {
                  const error = form.formState.errors.receiverEmail?.[i]
                  return (
                    <Button
                      key={mail}
                      variant={!!error ? 'destructive' : 'secondary'}
                      title={error?.message}
                      onClick={() => {
                        form.setValue(
                          'receiverEmail',
                          form
                            .getValues('receiverEmail')
                            .filter((m) => m !== mail),
                        )
                        form.trigger('receiverEmail')
                      }}
                    >
                      {mail}
                      <X className="h-4 w-4" />
                    </Button>
                  )
                })}
              </div>
            </div>
            {form.formState.errors.receiverEmail && !receiverEmail.length && (
              <p
                data-slot="form-message"
                className={'text-destructive text-sm'}
              >
                {form.formState.errors.receiverEmail?.message}
              </p>
            )}
            {form.formState.errors.receiverEmail &&
              form.formState.errors.receiverEmail.some?.((error) => {
                return !!error?.message
              }) && (
                <p
                  data-slot="form-message"
                  className={'text-destructive text-sm'}
                >
                  {t.inviteCodes.createForm.atLeastOneEmailInvalid}
                </p>
              )}
          </FormItem>
          <Button type="submit" className="" disabled={isLoading}>
            {isLoading
              ? t.inviteCodes.createForm.sending
              : t.inviteCodes.createForm.sendInvitation}
          </Button>
        </form>
      </Form>
    </>
  )
}

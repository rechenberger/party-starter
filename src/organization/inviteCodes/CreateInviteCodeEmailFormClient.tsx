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
import { createZodForm } from '@/lib/useZodForm'
import { SuperActionPromise } from '@/super-action/action/createSuperAction'
import { useSuperAction } from '@/super-action/action/useSuperAction'
import { uniq } from 'lodash-es'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useWatch } from 'react-hook-form'
import { z } from 'zod'

const CreateInviteCodeEmailSchema = z.object({
  role: z.enum(['admin', 'member']),
  receiverEmail: z
    .array(z.string().email('Not a valid email address'))
    .min(1, 'At least one email address is required'),
})

type CreateInviteCodeEmailData = z.infer<typeof CreateInviteCodeEmailSchema>

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

  const form = useCreateInviteCodeEmailForm({
    defaultValues: {
      role: 'member',
      receiverEmail: [],
    },
    disabled: isLoading,
  })

  const errors = form.formState.errors

  const [receiverEmail, setReceiverEmail] = useState('')

  const receiverMails = useWatch({
    control: form.control,
    name: 'receiverEmail',
  })

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (formData) => {
            await trigger(formData)
          })}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
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
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receiverEmail"
            render={({ field }) => {
              const handleAddReceiverEmail = () => {
                if (receiverEmail) {
                  form.setValue(
                    'receiverEmail',
                    uniq([...field.value, receiverEmail]),
                  )
                  setReceiverEmail('')
                }
              }
              return (
                <div>
                  <FormItem>
                    <FormLabel>Receiver</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                          <Input
                            type="email"
                            className="flex-1"
                            placeholder="john@example.com"
                            value={receiverEmail}
                            onChange={(e) => setReceiverEmail(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddReceiverEmail()
                              }
                            }}
                          />
                          <Button
                            variant="secondary"
                            size="icon"
                            disabled={!receiverEmail}
                            onClick={() => {
                              handleAddReceiverEmail()
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {receiverMails.map((mail, i) => {
                            const error = errors.receiverEmail?.[i]
                            return (
                              <Button
                                key={mail}
                                variant={error ? 'destructive' : 'secondary'}
                                title={error?.message}
                                onClick={() => {
                                  form.setValue(
                                    'receiverEmail',
                                    receiverMails.filter((m) => m !== mail),
                                  )
                                  form.clearErrors('receiverEmail')
                                }}
                              >
                                {mail}
                                <X className="h-4 w-4" />
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )
            }}
          />

          <Button type="submit" className="" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Invitation'}
          </Button>
        </form>
      </Form>
    </>
  )
}

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
import { X } from 'lucide-react'
import { useState } from 'react'
import { useWatch } from 'react-hook-form'
import { z } from 'zod'

const CreateInviteCodeEmailSchema = z.object({
  role: z.enum(['admin', 'member']),
  receiverEmail: z.array(z.string().min(10, 'Email is required')).min(1),
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
              return (
                <div>
                  <FormItem>
                    <FormLabel>Receiver</FormLabel>
                    <FormControl>
                      <>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          value={receiverEmail}
                          onChange={(e) => setReceiverEmail(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              form.setValue(
                                'receiverEmail',
                                uniq([...field.value, receiverEmail]),
                              )
                              setReceiverEmail('')
                            }
                          }}
                        />
                        <div className="flex flex-wrap gap-2">
                          {receiverMails.map((mail) => (
                            <Button
                              key={mail}
                              variant="secondary"
                              onClick={() => {
                                form.setValue(
                                  'receiverEmail',
                                  receiverMails.filter((m) => m !== mail),
                                )
                              }}
                            >
                              {mail}
                              <X className="h-4 w-4" />
                            </Button>
                          ))}
                        </div>
                      </>
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

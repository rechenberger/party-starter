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
import { z } from 'zod'

const CreateInviteCodeEmailSchema = z.object({
  role: z.enum(['admin', 'member']),
  receiverEmail: z.string().email(),
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

  const disabled = isLoading

  const form = useCreateInviteCodeEmailForm({
    defaultValues: {
      role: 'member',
      receiverEmail: '',
    },
    disabled,
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receiver Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    placeholder="john@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2" disabled={disabled}>
            Send Invitation
          </Button>
        </form>
      </Form>
    </>
  )
}

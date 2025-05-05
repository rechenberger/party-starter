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
import { organizationRoleDefinitions } from '../organizationRoles'

const CreateInviteCodeSchema = z.object({
  role: z.enum(['admin', 'member']),
  expiresAt: z.enum(['never', '1d', '1w', '1m', '1y']),
  usesMax: z.coerce.number().optional(),
  comment: z.string().optional(),
})

export type ExpiresAt = z.infer<typeof CreateInviteCodeSchema>['expiresAt']

type CreateInviteCodeData = z.infer<typeof CreateInviteCodeSchema>

const [useCreateInviteCodeForm] = createZodForm(CreateInviteCodeSchema)

export const CreateInviteCodeFormClient = ({
  action,
}: {
  action: (
    data: CreateInviteCodeData,
  ) => SuperActionPromise<void, CreateInviteCodeData>
}) => {
  const { trigger, isLoading } = useSuperAction({
    action,
    catchToast: true,
  })

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
                      {organizationRoleDefinitions.map((role) => (
                        <SelectItem key={role.name} value={role.name}>
                          {role.label}
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
                <FormLabel>Expires At</FormLabel>
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
                      <SelectValue placeholder="Select expires at" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                      <SelectItem value="1w">1 Week</SelectItem>
                      <SelectItem value="1m">1 Month</SelectItem>
                      <SelectItem value="1y">1 Year</SelectItem>
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
                <FormLabel>Max Uses</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="unlimited" />
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
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Add an optional Comment"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2" disabled={disabled}>
            Create Invite Code
          </Button>
        </form>
      </Form>
    </>
  )
}

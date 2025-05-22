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
import { createZodForm } from '@/lib/useZodForm'
import { SuperActionPromise } from '@/super-action/action/createSuperAction'
import { useSuperAction } from '@/super-action/action/useSuperAction'
import { z } from 'zod'

const CreateOrgSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
})

type CreateOrgData = z.infer<typeof CreateOrgSchema>

const [useCreateOrgForm] = createZodForm(CreateOrgSchema)

export const CreateOrgFormClient = ({
  action,
}: {
  action: (data: CreateOrgData) => SuperActionPromise<void, CreateOrgData>
}) => {
  const { trigger, isLoading } = useSuperAction({
    action,
    catchToast: true,
  })

  const disabled = isLoading

  const form = useCreateOrgForm({
    defaultValues: {
      name: '',
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-2" disabled={disabled}>
            Create Organization
          </Button>
        </form>
      </Form>
    </>
  )
}

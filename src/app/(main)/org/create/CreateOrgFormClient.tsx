'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { SuperActionWithInput } from '@/super-action/action/createSuperAction'
import { useSuperAction } from '@/super-action/action/useSuperAction'
import { z } from 'zod'
import { NameSchema } from './NameSchema'

const CreateOrgSchema = z.object({
  name: NameSchema,
})

type CreateOrgSchema = z.infer<typeof CreateOrgSchema>

const [useCreateOrgForm] = createZodForm(CreateOrgSchema)

export const CreateOrgFormClient = ({
  action,
}: {
  action: SuperActionWithInput<CreateOrgSchema>
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
      <div className="flex-1"></div>
      <Card className="self-center w-full max-w-md flex flex-col gap-4">
        <CardHeader>
          <CardTitle>Create Organization</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (values) => {
                await trigger(values)
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
                      <Input {...field} placeholder="Enter organization name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-2 justify-end">
                <Button type="submit" disabled={disabled}>
                  Create Organization
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="flex-1"></div>
    </>
  )
}

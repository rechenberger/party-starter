import { getMyUser } from '@/auth/getMyUser'
import SeededAvatar from '@/components/SeededAvatar'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { db } from '@/db/db'
import { organizationMembershipsTable, organizationsTable } from '@/db/schema'
import { slugify } from '@/lib/slugify'
import { cn } from '@/lib/utils'
import {
  streamDialog,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionWrapper } from '@/super-action/button/ActionWrapper'
import { eq } from 'drizzle-orm'
import { Check, ChevronsUpDown, PlusCircleIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { CreateOrgFormClient } from './CreateOrgFormClient'

export default async function OrganizationPicker(params: {
  organizationSlug?: string
}) {
  return (
    <Suspense fallback={<Skeleton className="w-[200px] h-[40px]" />}>
      <OrganizationPickerInside {...params} />
    </Suspense>
  )
}

async function OrganizationPickerInside({
  organizationSlug,
}: {
  organizationSlug?: string
}) {
  const user = await getMyUser()
  if (!user) {
    return null
  }
  const memberships = await db.query.organizationMembershipsTable.findMany({
    where: eq(organizationMembershipsTable.userId, user.id),
    with: {
      organization: true,
    },
  })

  const selectedMembership = memberships.find(
    (membership) => membership.organization.slug === organizationSlug,
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Select an organization"
          className={cn('w-[200px] justify-between')}
        >
          <div className="mr-2">
            <SeededAvatar
              size={20}
              style="shape"
              value={selectedMembership?.organization.name ?? ''}
            />
          </div>
          <span className="truncate">
            {selectedMembership?.organization.name ?? 'Select Organization'}
          </span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search your organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              {memberships.map(({ organization }) => (
                <CommandItem
                  key={organization.id}
                  value={organization.name}
                  className="text-sm"
                  onSelect={async () => {
                    'use server'
                    redirect(`/organization/${organization.slug}`)
                  }}
                >
                  <div className="mr-2">
                    <SeededAvatar
                      size={20}
                      style="shape"
                      value={organization.name}
                    />
                  </div>
                  {organization.name}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      selectedMembership?.organizationId === organization.id
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            {user.isAdmin && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <ActionWrapper
                    triggerOn={['onSelect']}
                    action={async () => {
                      'use server'
                      return superAction(async () => {
                        streamDialog({
                          title: 'Create Organization',
                          content: (
                            <CreateOrgFormClient
                              action={async (data) => {
                                'use server'
                                return superAction(async () => {
                                  const newOrg = await db
                                    .insert(organizationsTable)
                                    .values({
                                      name: data.name,
                                      slug: slugify(data.name),
                                    })
                                    .returning()

                                  await db
                                    .insert(organizationMembershipsTable)
                                    .values({
                                      userId: user.id,
                                      organizationId: newOrg[0].id,
                                      role: 'admin',
                                    })
                                  streamDialog(null)
                                  redirect(`/organization/${newOrg[0].slug}`)
                                })
                              }}
                            />
                          ),
                        })
                      })
                    }}
                  >
                    <CommandItem className="group">
                      <PlusCircleIcon className="mr-2 size-4" />
                      Create Organization
                    </CommandItem>
                  </ActionWrapper>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

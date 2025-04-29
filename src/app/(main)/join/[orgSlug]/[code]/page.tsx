// page where you can join the current org using the orgslug and the code

import { getMyUserOrLogin } from '@/auth/getMyUser'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { superAction } from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { and, eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'

export default async function JoinOrgPage({
  params,
}: {
  params: Promise<{ orgSlug: string; code: string }>
}) {
  const { orgSlug, code } = await params

  const org = await db.query.organizations.findFirst({
    where: eq(schema.organizations.slug, orgSlug),
  })
  console.log({ org })

  if (!org) {
    return notFound()
  }

  const inviteCode = await db.query.inviteCodes.findFirst({
    where: and(
      eq(schema.inviteCodes.id, code),
      eq(schema.inviteCodes.organizationId, org.id),
    ),
  })

  console.log({ inviteCode })

  if (!inviteCode) {
    return notFound()
  }

  let invalidReason: string | null = null

  if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
    invalidReason = 'Expired'
  }

  if (
    inviteCode.maxUses &&
    inviteCode.currentUses &&
    inviteCode.currentUses >= inviteCode.maxUses
  ) {
    invalidReason = 'Max uses reached'
  }

  if (invalidReason) {
    return <div>Invalid reason: {invalidReason}</div>
  }

  return (
    <div>
      <h1>Join Org</h1>
      <p>
        You are about to join {org.name} using the code {code} as{' '}
        {inviteCode.role}
      </p>
      <ActionButton
        action={async () => {
          'use server'
          return superAction(async () => {
            const user = await getMyUserOrLogin()

            await db.insert(schema.organizationMemberships).values({
              organizationId: org.id,
              userId: user.id,
              role: inviteCode.role,
              invitationCodeId: inviteCode.id,
            })

            await db
              .update(schema.inviteCodes)
              .set({
                currentUses: inviteCode.currentUses ?? 0 + 1,
              })
              .where(eq(schema.inviteCodes.id, inviteCode.id))

            redirect(`/org/${org.slug}`)
          })
        }}
      >
        Join {org.name}
      </ActionButton>
    </div>
  )
}

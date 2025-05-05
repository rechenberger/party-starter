import { getMyUserOrLogin } from '@/auth/getMyUser'
import SeededAvatar from '@/components/SeededAvatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { db } from '@/db/db'
import { schema } from '@/db/schema-export'
import { superAction } from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { and, eq, isNull } from 'drizzle-orm'
import { find } from 'lodash-es'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'

export default async function JoinOrgPage({
  params,
}: {
  params: Promise<{ orgSlug: string; code: string }>
}) {
  const { orgSlug, code } = await params

  const user = await getMyUserOrLogin({
    forceRedirectUrl: `/join/${orgSlug}/${code}`,
  })

  const organization = await db.query.organizations.findFirst({
    where: eq(schema.organizations.slug, orgSlug),
    with: {
      memberships: true,
    },
  })

  if (!organization) {
    return notFound()
  }

  const inviteCode = await db.query.inviteCodes.findFirst({
    where: and(
      eq(schema.inviteCodes.id, code),
      eq(schema.inviteCodes.organizationId, organization.id),
      isNull(schema.inviteCodes.deletedAt),
    ),
  })

  if (!inviteCode) {
    return notFound()
  }

  let invalidReason: string | null = null

  if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
    invalidReason = 'Expired'
  } else if (
    inviteCode.maxUses &&
    inviteCode.currentUses &&
    inviteCode.currentUses >= inviteCode.maxUses
  ) {
    invalidReason = 'Max uses reached'
  }

  // Render invalid state
  if (invalidReason) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Invalid Invitation</CardTitle>
            </div>
            <CardDescription>
              This invitation link cannot be used.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {invalidReason === 'Expired'
                  ? 'This invitation has expired.'
                  : 'This invitation has reached its maximum number of uses.'}
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-4 mt-6">
              <SeededAvatar value={organization.slug} />
              <div>
                <h3 className="font-medium">{organization.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Invitation Code: {code}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <ActionButton
              className="w-full"
              action={async () => {
                'use server'
                redirect(`/`)
              }}
            >
              Return to Home
            </ActionButton>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const membership = find(organization.memberships, (m) => m.userId === user.id)

  // Render success state (after joining)
  if (membership) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <CardTitle>Successfully Joined!</CardTitle>
            </div>
            <CardDescription>
              You are now a member of {organization.name}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <SeededAvatar value={organization.slug} />
              <h2 className="text-xl font-bold mb-1">{organization.name}</h2>
              <Badge
                variant={inviteCode.role === 'admin' ? 'default' : 'secondary'}
                className="mb-4"
              >
                {inviteCode.role}
              </Badge>
              <p className="text-center text-muted-foreground">
                You now have access to all resources shared with{' '}
                {inviteCode.role}s in this organization.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <ActionButton
              className="w-full"
              action={async () => {
                'use server'
                redirect(`/org/${organization.slug}`)
              }}
            >
              Go to Organization
            </ActionButton>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Render join state (valid invitation)
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Organization</CardTitle>
          <CardDescription>
            You&apos;ve been invited to join an organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <SeededAvatar size={100} value={organization.slug} />
            <h2 className="text-xl font-bold">{organization.name}</h2>
            <p className="text-sm text-muted-foreground">
              Invitation Code: {code}
            </p>
            <Badge
              variant={inviteCode.role === 'admin' ? 'default' : 'secondary'}
            >
              {inviteCode.role === 'admin' ? 'Admin Role' : 'Member Role'}
            </Badge>

            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-sm">
                {inviteCode.role === 'admin' ? (
                  <ShieldAlert className="h-4 w-4 text-primary" />
                ) : (
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                )}
                <span>
                  You will join as{' '}
                  <span className="font-medium">
                    {inviteCode.role === 'admin'
                      ? 'an administrator'
                      : 'a member'}
                  </span>
                </span>
              </div>

              {inviteCode.expiresAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Expires on{' '}
                    {inviteCode.expiresAt.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {inviteCode.maxUses && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {inviteCode.currentUses ?? 0} of {inviteCode.maxUses} uses
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <ActionButton
            variant="default"
            className="w-full"
            action={async () => {
              'use server'
              return superAction(async () => {
                await db.insert(schema.organizationMemberships).values({
                  organizationId: organization.id,
                  userId: user.id,
                  role: inviteCode.role,
                  invitationCodeId: inviteCode.id,
                })
                revalidatePath(`/join/${organization.slug}/${code}`)
              })
            }}
          >
            Join Organization
          </ActionButton>
          <ActionButton
            variant="outline"
            className="w-full"
            action={async () => {
              'use server'
              redirect(`/`)
            }}
          >
            Cancel
          </ActionButton>
        </CardFooter>
      </Card>
    </div>
  )
}

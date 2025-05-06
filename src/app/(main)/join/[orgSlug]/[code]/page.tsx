import SeededAvatar from '@/components/SeededAvatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { getInviteCode } from '@/organization/inviteCodes/getInviteCode'
import { superAction } from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { eq } from 'drizzle-orm'
import { find } from 'lodash-es'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

export default async function JoinOrgPage({
  params,
}: {
  params: Promise<{ orgSlug: string; code: string }>
}) {
  const { orgSlug, code } = await params

  const { error, organization, inviteCode, user } = await getInviteCode({
    orgSlug,
    code,
  })

  if (error === 'Organization not found') {
    return notFound()
  }

  if (error === 'Invite code not found') {
    return notFound()
  }

  const alreadyOrgMember = !!find(
    organization.memberships,
    (m) => m.userId === user.id,
  )

  // Card if already joined the team
  if (alreadyOrgMember) {
    return (
      <CardShell>
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
          <JoinCardOrgInfo
            organization={organization}
            inviteCode={inviteCode}
            code={code}
          />
          <p className="text-center text-muted-foreground">
            You now have access to all resources shared with {inviteCode.role}s
            in this organization.
          </p>
        </CardContent>
        <CardFooter>
          <Link href={`/org/${organization.slug}`} className="w-full">
            <Button className="w-full">Go to Organization</Button>
          </Link>
        </CardFooter>
      </CardShell>
    )
  }

  // Card if code is invalid
  if (error === 'Expired' || error === 'Max uses reached') {
    return (
      <CardShell>
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
              {error === 'Expired'
                ? 'This invitation has expired.'
                : 'This invitation has reached its maximum number of uses.'}
            </AlertDescription>
          </Alert>

          <JoinCardOrgInfo
            organization={organization}
            inviteCode={inviteCode}
            code={code}
          />
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
      </CardShell>
    )
  }

  // Render join state (valid invitation)
  return (
    <CardShell>
      <CardHeader>
        <CardTitle>Join Organization</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join an organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <JoinCardOrgInfo
          organization={organization}
          inviteCode={inviteCode}
          code={code}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <ActionButton
          variant="default"
          className="w-full"
          action={async () => {
            'use server'
            return superAction(async () => {
              const { error, organization, inviteCode, user } =
                await getInviteCode({ orgSlug, code })

              if (error) {
                throw new Error(error)
              }

              await Promise.all([
                db
                  .update(schema.inviteCodes)
                  .set({
                    usesCurrent: (inviteCode.usesCurrent ?? 0) + 1,
                  })
                  .where(eq(schema.inviteCodes.id, inviteCode.id)),
                db.insert(schema.organizationMemberships).values({
                  organizationId: organization.id,
                  userId: user.id,
                  role: inviteCode.role,
                  invitationCodeId: inviteCode.id,
                }),
              ])
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
    </CardShell>
  )
}

const JoinCardOrgInfo = ({
  organization,
  inviteCode,
  code,
}: {
  organization: NonNullable<
    Awaited<ReturnType<typeof getInviteCode>>['organization']
  >
  inviteCode: NonNullable<
    Awaited<ReturnType<typeof getInviteCode>>['inviteCode']
  >
  code: string
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-2">
      <SeededAvatar size={100} value={organization.slug} />
      <h2 className="text-xl font-bold">{organization.name}</h2>
      <p className="text-sm text-muted-foreground">Invitation Code: {code}</p>
      <Badge variant={inviteCode.role === 'admin' ? 'default' : 'secondary'}>
        {inviteCode.role === 'admin' ? 'Admin Role' : 'Member Role'}
      </Badge>
    </div>
  )
}

const CardShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">{children}</Card>
    </div>
  )
}

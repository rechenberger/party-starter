import { getMyUserOrLogin } from '@/auth/getMyUser'
import { OrgAvatar } from '@/components/OrgAvatar'
import { Alert, AlertTitle } from '@/components/ui/alert'
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
import { getTranslations } from '@/i18n/getTranslations'
import { superCache } from '@/lib/superCache'
import { getInviteCode } from '@/organization/inviteCodes/getInviteCode'
import { superAction } from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { eq } from 'drizzle-orm'
import { find } from 'lodash-es'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
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

  const { error, org, inviteCode } = await getInviteCode({
    orgSlug,
    code,
  })

  if (error === 'Organization not found') {
    return notFound()
  }

  if (error === 'Invite code not found') {
    return notFound()
  }

  const alreadyOrgMember = !!find(org.memberships, (m) => m.userId === user.id)
  const t = await getTranslations()

  // Card if already joined the team
  if (alreadyOrgMember) {
    return (
      <CardShell>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <CardTitle>{t.org.join.successTitle}</CardTitle>
          </div>
          <CardDescription>
            {t.org.join.successDescription(org.name)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JoinCardOrgInfo org={org} inviteCode={inviteCode} code={code} />
          <p className="text-center text-muted-foreground">
            {t.org.join.accessDescription}
          </p>
        </CardContent>
        <CardFooter>
          <Link href={`/org/${org.slug}`} className="w-full">
            <Button className="w-full">{t.org.join.goToOrganization}</Button>
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
            <CardTitle>{t.org.join.invalidInvitationTitle}</CardTitle>
          </div>
          <CardDescription>
            {t.org.join.invalidInvitationDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {error === 'Expired'
                ? t.org.join.expiredInvitationDescription
                : t.org.join.maxUsesReachedDescription}
            </AlertTitle>
          </Alert>

          <JoinCardOrgInfo org={org} inviteCode={inviteCode} code={code} />
        </CardContent>
        <CardFooter>
          <Link href={`/`} className="w-full">
            <Button className="w-full">{t.org.join.returnToHome}</Button>
          </Link>
        </CardFooter>
      </CardShell>
    )
  }

  // Render join state (valid invitation)
  return (
    <CardShell>
      <CardHeader>
        <CardTitle>{t.org.join.joinOrganization}</CardTitle>
        <CardDescription>
          {t.org.join.joinOrganizationDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <JoinCardOrgInfo org={org} inviteCode={inviteCode} code={code} />
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <ActionButton
          variant="default"
          className="w-full"
          action={async () => {
            'use server'
            return superAction(async () => {
              const user = await getMyUserOrLogin({
                forceRedirectUrl: `/join/${orgSlug}/${code}`,
              })

              const { error, org, inviteCode } = await getInviteCode({
                orgSlug,
                code,
              })

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
                  organizationId: org.id,
                  userId: user.id,
                  role: inviteCode.role,
                  invitationCodeId: inviteCode.id,
                }),
              ])

              superCache.userOrgMemberships({ userId: user.id }).revalidate()
              superCache.orgMembers({ orgId: org.id }).revalidate()
            })
          }}
        >
          {t.org.join.joinOrganization}
        </ActionButton>
        <ActionButton
          variant="outline"
          className="w-full"
          action={async () => {
            'use server'
            redirect(`/`)
          }}
        >
          {t.standardWords.cancel}
        </ActionButton>
      </CardFooter>
    </CardShell>
  )
}

const JoinCardOrgInfo = async ({
  org,
  inviteCode,
  code,
}: {
  org: NonNullable<Awaited<ReturnType<typeof getInviteCode>>['org']>
  inviteCode: NonNullable<
    Awaited<ReturnType<typeof getInviteCode>>['inviteCode']
  >
  code: string
}) => {
  const t = await getTranslations()
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-2">
      <OrgAvatar org={org} size={100} />
      <h2 className="text-xl font-bold">{org.name}</h2>
      <p className="text-sm text-muted-foreground">
        {t.org.join.invitationCode}: {code}
      </p>
      <Badge variant={inviteCode.role === 'admin' ? 'default' : 'secondary'}>
        {inviteCode.role === 'admin'
          ? t.org.join.adminRole
          : t.org.join.memberRole}
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

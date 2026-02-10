import { createEmailTemplate } from '@/lib/createEmailTemplate'
import { OrganizationRole } from '@/organization/organizationRoles'
import { Button, Heading, Link, Section, Text } from '@react-email/components'
import { z } from 'zod'
import { DefaultTemplate } from './DefaultTemplate'

export const orgInviteEmail = createEmailTemplate({
  name: 'org-invite',
  schema: z.object({
    invitedByUsername: z.string().nullable(),
    invitedByEmail: z.string(),
    orgName: z.string(),
    inviteLink: z.string(),
    role: OrganizationRole,
  }),
  previewProps: {
    invitedByUsername: 'Alan',
    invitedByEmail: 'alan.turing@example.com',
    orgName: 'Enigma',
    inviteLink: 'https://vercel.com',
    role: 'admin',
  },
  subject: async ({ props, t }) => {
    return t.email.orgInvite.subjectText({
      orgName: props.orgName,
    })
  },
  Email: async ({ props, t, locale }) => {
    const { invitedByUsername, invitedByEmail, orgName, inviteLink, role } =
      props
    const previewText = t.email.orgInvite.subjectText({
      orgName,
    })
    return (
      <DefaultTemplate previewText={previewText} locale={locale}>
        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
          {t.email.orgInvite.welcome(orgName)}
        </Heading>
        <Text className="text-black text-[14px] leading-[24px]">
          {t.email.orgInvite.greeting}
        </Text>
        <Text className="text-black text-[14px] leading-[24px]">
          {t.email.orgInvite.description({
            invitedByUsername,
            invitedByEmail,
            orgName,
            role,
          })}
        </Text>
        <Section className="text-center mt-[32px] mb-[32px]">
          <Button
            className="bg-primary rounded text-primary-foreground text-[12px] font-semibold no-underline text-center px-5 py-3"
            href={inviteLink}
          >
            {t.email.orgInvite.joinButton(orgName)}
          </Button>
        </Section>
        <Text className="text-black text-[14px] leading-[24px]">
          {t.email.orgInvite.fallback}:{' '}
          <Link href={inviteLink} className="text-blue-600 no-underline">
            {inviteLink}
          </Link>
        </Text>
      </DefaultTemplate>
    )
  },
})

export default orgInviteEmail.preview()

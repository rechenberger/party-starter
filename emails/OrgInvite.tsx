import { BRAND } from '@/lib/starter.config'
import { Button, Heading, Link, Section, Text } from '@react-email/components'
import { DefaultTemplate } from './DefaultTemplate'

type OrgInviteProps = {
  invitedByUsername?: string | null
  invitedByEmail: string
  orgName: string
  inviteLink: string
  role: 'admin' | 'member'
}

export const OrgInvite = ({
  invitedByUsername,
  invitedByEmail,
  orgName,
  inviteLink,
  role,
}: OrgInviteProps) => {
  const previewText = `Join ${invitedByUsername} on ${BRAND.name}`

  return (
    <DefaultTemplate previewText={previewText}>
      <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
        Join <strong>{orgName}</strong> on <BRAND.TextLogo />
      </Heading>
      <Text className="text-black text-[14px] leading-[24px]">Hello,</Text>
      <Text className="text-black text-[14px] leading-[24px]">
        <strong>{invitedByUsername ?? invitedByEmail}</strong>
        {invitedByUsername && ` (${invitedByEmail})`} has invited you to the{' '}
        <strong>{orgName}</strong> organization as {role} on <BRAND.TextLogo />.
      </Text>
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          className="bg-primary rounded text-primary-foreground text-[12px] font-semibold no-underline text-center px-5 py-3"
          href={inviteLink}
        >
          Join the organization
        </Button>
      </Section>
      <Text className="text-black text-[14px] leading-[24px]">
        or copy and paste this URL into your browser:{' '}
        <Link href={inviteLink} className="text-blue-600 no-underline">
          {inviteLink}
        </Link>
      </Text>
    </DefaultTemplate>
  )
}

OrgInvite.PreviewProps = {
  invitedByUsername: 'Alan',
  invitedByEmail: 'alan.turing@example.com',
  orgName: 'Enigma',
  inviteLink: 'https://vercel.com',
  role: 'admin',
} satisfies OrgInviteProps

export default OrgInvite

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { DefaultTemplate } from './DefaultTemplate'

interface OrgInviteProps {
  username?: string
  // userImage?: string
  invitedByUsername?: string
  invitedByEmail?: string
  orgName?: string
  // teamImage?: string
  inviteLink?: string
  // inviteFromIp?: string
  // inviteFromLocation?: string
}

export const OrgInvite = ({
  username,
  // userImage,
  invitedByUsername,
  invitedByEmail,
  orgName,
  // teamImage,
  inviteLink,
  // inviteFromIp,
  // inviteFromLocation,
}: OrgInviteProps) => {
  const previewText = `Join ${invitedByUsername} on Vercel`

  return (
    <DefaultTemplate previewText={previewText}>
      <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
        Join <strong>{orgName}</strong> on <strong>Party Starter</strong>
      </Heading>
      <Text className="text-black text-[14px] leading-[24px]">
        Hello {username},
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        <strong>{invitedByUsername}</strong> (
        <Link
          href={`mailto:${invitedByEmail}`}
          className="text-blue-600 no-underline"
        >
          {invitedByEmail}
        </Link>
        ) has invited you to the <strong>{orgName}</strong> organization on{' '}
        <strong>Party Starter</strong>.
      </Text>
      {/* <Section>
        <Row>
          <Column align="right">
            <Img
              className="rounded-full"
              src={userImage}
              width="64"
              height="64"
              alt={`${username}'s profile picture`}
            />
          </Column>
          <Column align="center">
            <Img
              src={`/static/vercel-arrow.png`}
              width="12"
              height="9"
              alt="Arrow indicating invitation"
            />
          </Column>
          <Column align="left">
            <Img
              className="rounded-full"
              src={teamImage}
              width="64"
              height="64"
              alt={`${teamName} team logo`}
            />
          </Column>
        </Row>
      </Section> */}
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
  username: 'alanturing',
  // userImage: `/static/vercel-user.png`,
  invitedByUsername: 'Alan',
  invitedByEmail: 'alan.turing@example.com',
  orgName: 'Enigma',
  // teamImage: `/static/vercel-team.png`,
  inviteLink: 'https://vercel.com',
  // inviteFromIp: '204.13.186.218',
  // inviteFromLocation: 'São Paulo, Brazil',
} as OrgInviteProps

export default OrgInvite

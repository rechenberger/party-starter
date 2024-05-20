import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  streamCommands,
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { Button } from '../ui/button'

export const CommandsButton = () => {
  return (
    <>
      <ActionButton
        variant={'outline'}
        command={{
          shortcut: {
            key: 'c',
          },
        }}
        hideButton
        action={async () => {
          'use server'

          return superAction(async () => {
            const stargazers = await fetch(
              'https://api.github.com/repos/rechenberger/party-starter/stargazers',
              {
                next: {
                  revalidate: 60, // every minute
                },
              },
            )
              .then((res) => res.json())
              .then(
                z.array(
                  z
                    .object({
                      login: z.string(),
                      html_url: z.string(),
                      avatar_url: z.string().nullish(),
                    })
                    .passthrough(),
                ).parse,
              )

            streamCommands({
              placeholder: 'Find others who like to party...',
              emptyLabel: 'No party animals found.',
              commands: stargazers.map((stargazer) => ({
                label: (
                  <>
                    <div className="flex flex-row gap-2 items-center px-1">
                      <Avatar className="w-5 h-5">
                        <AvatarImage
                          src={stargazer.avatar_url ?? ''}
                          alt={stargazer.login}
                        />
                        <AvatarFallback>
                          {stargazer.login[0]?.toUpperCase() || '??'}
                        </AvatarFallback>
                      </Avatar>
                      {stargazer.login}
                    </div>
                  </>
                ),
                action: async () => {
                  'use server'
                  return superAction(async () => {
                    streamToast({
                      title: `${stargazer.login} likes to party!`,
                      description: (
                        <>
                          <Button asChild>
                            <Link href={stargazer.html_url} target="blank">
                              Visit Github Profile
                              <ExternalLink className="size-4 ml-1" />
                            </Link>
                          </Button>
                        </>
                      ),
                    })
                  })
                },
              })),
            })
          })
        }}
      >
        streamCommands() Demo
      </ActionButton>
    </>
  )
}

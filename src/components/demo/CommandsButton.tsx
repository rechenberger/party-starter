import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  streamCommands,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { redirect } from 'next/navigation'
import { z } from 'zod'

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
                    redirect(stargazer.html_url)
                  })
                },
              })),
            })
          })
        }}
      >
        Command!
      </ActionButton>
    </>
  )
}

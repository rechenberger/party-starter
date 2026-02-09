import { Button } from '@/components/ui/button'
import {
  streamDialog,
  streamToast,
  superAction,
} from '@/super-action/action/createSuperAction'
import { ActionButton } from '@/super-action/button/ActionButton'
import { ExternalLink, PartyPopper } from 'lucide-react'
import Link from 'next/link'
import { Markdown } from './Markdown'

export const PartyButton = () => {
  return (
    <ActionButton
      command={{
        label: 'Party Source',
        shortcut: {
          key: 'p',
        },
      }}
      icon={<PartyPopper />}
      action={async () => {
        'use server'

        return superAction(async () => {
          streamToast({
            title: 'Demo Hinweis',
            description:
              'Die alte ai/rsc-Demo wurde fuer das SDK-Upgrade deaktiviert.',
          })

          const file = await fetch(
            'https://raw.githubusercontent.com/rechenberger/party-starter/main/src/components/demo/PartyButton.tsx',
          ).then((res) => res.text())

          streamDialog({
            title: 'PartyButton.tsx',
            content: (
              <>
                <div className="flex max-h-[60vh] max-w-full overflow-scroll text-xs">
                  <Markdown className="max-w-none">{`\`\`\`tsx\n${file}\n\`\`\``}</Markdown>
                </div>
                <Link
                  href="https://github.com/rechenberger/party-starter/blob/main/src/components/demo/PartyButton.tsx"
                  target="_blank"
                >
                  <Button>
                    Goto Source
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </>
            ),
          })
        })
      }}
    >
      Party!
    </ActionButton>
  )
}

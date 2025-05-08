import { type t as enT } from './translations.en'

export const t = {
  welcome: {
    title: (
      <>
        Willkommen im Party <b className="text-primary">Starter</b>
      </>
    ),
  },
  standardWords: {
    users: 'Benutzer',
  },
} satisfies typeof enT

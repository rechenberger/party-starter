import { TranslationsClient } from './translations.en'

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
  org: {
    create: 'Organisation erstellen',
  },
} satisfies TranslationsClient

# Party Starter

## Features

- The basics you love with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)
- Quick Setup with [Auth.js](https://authjs.dev/), [drizzle](https://orm.drizzle.team/) and [NeonDB](https://neon.tech)
- Powerful Server-Actions with
  - ActionButton
  - CMD-K Menu
  - Keyboard-Shortcuts
  - streamToast()
  - streamDialog()

## Setup

- Configure the features you want in [starter.config.ts](src/lib/starter.config.ts)
- Run `pnpm starter:init` to setup the project
- Create [.env.local](.env.local)
- Generate Auth Secret
  - run `npx auth secret`
  - copy `AUTH_SECRET` to [.env.local](.env.local)
- Connect DB
  - [Create Neon Database](https://console.neon.tech/app/projects)
  - `DATABASE_URL`: looks like postgresql://...
- Connect OAuth
  - [Create Discord Developer App](https://discord.com/developers/applications)
  - Goto OAuth2
  - `AUTH_DISCORD_ID`: Copy Client ID
  - `AUTH_DISCORD_SECRET`: Reset Secret
  - Add Redirects:
  - `http://localhost:3000/api/auth/callback/discord`
  - `https://your-app.com/api/auth/callback/discord`
- Email
  - Specify an SMTP server
  - `EMAIL_FROM`="moin@party-starter.de"
  - `SMTP_URL`="smtp://[user]:[password]@sandbox.smtp.mailtrap.io:[port]"
- `pnpm db:push` to push schema to DB
- Cron Jobs
  - Add cron jobs to [crons.ts](src/super-cron/crons.ts)
  - Set `isActive` to `true` to activate the cron job
  - Add `/api/cron/{cronName}` to your app (see [test cron](src/app/api/cron/test/route.ts)) for an example
  - Run `pnpm install` to sync the cron jobs to vercel.json
  - Add an Environment Variable `CRON_SECRET` to your app
    - If you use [Gitenvs](https://www.npmjs.com/package/gitenvs) and Vercel you need to set the `CRON_SECRET` directly in Vercel not in Gitenvs

## Run

```bash
pnpm install
pnpm dev
```

## Libraries

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [pnpm](https://pnpm.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [@teampilot/sdk](https://sdk.teampilot.ai/)
- [drizzle](https://orm.drizzle.team/)
- [Auth.js](https://authjs.dev/)
- [@sodefa/next-server-context](https://github.com/rechenberger/next-server-context)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

## Update

You can get the latest changes from the template by running:

```bash
git remote add template https://github.com/rechenberger/party-starter.git
git fetch --all
git merge template/main --allow-unrelated-histories
```

You might have to resolve a few merge conflicts, but that's it!

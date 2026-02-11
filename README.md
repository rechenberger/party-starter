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
  - add `NEON_PROJECT_ID` to [.env.local](.env.local)
  - run `pnpm neon:auth` once
  - run `pnpm neon:dev:use` to create/reset your `dev/<username>` branch and set `DATABASE_URL`
  - run `pnpm neon:dev:seed` for a fresh schema-only branch + seeded local data
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

## Neon Branches (Dev)

- `pnpm neon:dev:use`: create-or-reset your `dev/<username>` branch from `production` and update `DATABASE_URL`
- `pnpm neon:dev:env`: only update `DATABASE_URL` for your branch (no create/reset)
- `pnpm neon:prod:env`: set `DATABASE_URL` to the `production` branch
- `pnpm neon:dev:create` / `pnpm neon:dev:reset` / `pnpm neon:dev:delete`: explicit branch actions
- `pnpm neon:dev:seed`: delete `dev/<username>`, recreate schema-only, set `DATABASE_URL`, run `pnpm db:push`, then `pnpm e2e:seed`
- override target with `--username <name>` or `--branch <branch-name>`

## E2E Testing

This template has a dual-mode Playwright setup:

- CI mode (`next build` + `next start`) with a dedicated schema-only Neon branch per run
- Dev mode (`next dev`) for fast local iteration without forced branch lifecycle

### Setup

- Install Playwright browser once:
  - `pnpm e2e:install`
- Ensure `AUTH_SECRET` is set
- CI mode additionally requires:
  - `NEON_PROJECT_ID`
  - `NEON_API_KEY`

### GitHub Actions Setup

- Workflow file:
  - `.github/workflows/e2e.yml`
- Add these **Repository secrets** in GitHub:
  - `Settings` -> `Secrets and variables` -> `Actions` -> `Repository secrets`
  - `AUTH_SECRET`
  - `NEON_PROJECT_ID`
  - `NEON_API_KEY`
- Optional repository variable:
  - `E2E_WORKERS` (override automatic worker count in CI)
- Note:
  - This workflow currently reads `secrets.*` and does not set `jobs.<job>.environment`, so use repository secrets (not environment-scoped secrets).

### CI Mode (production-like)

- Run full orchestration:
  - `pnpm e2e:ci`
- This does:
  - create unique Neon test branch (`e2e/<run-id>`, schema-only)
  - `pnpm db:push`
  - `pnpm e2e:seed`
  - `next build` + `next start`
  - Playwright run (`playwright.ci.config.ts`)
  - branch cleanup (delete, plus expiration fallback)

### Dev Mode (local changes)

- Use existing local dev server or let Playwright start one:
  - `pnpm e2e:dev`
- Run specific files:
  - `pnpm e2e:dev -- e2e/specs/org-members.spec.ts`
- Run grep filter:
  - `pnpm e2e:dev -- --grep \"impersonate\"`

### Seed and Artifacts

- Seed script (manual in dev mode):
  - `pnpm e2e:seed`
- Full local Neon refresh + seed:
  - `pnpm neon:dev:seed`
- Default artifacts:
  - `.e2e-artifacts/<run-id>/...`
- E2E env contracts:
  - `E2E_MODE=ci|dev`
  - `E2E_RUN_ID`
  - `E2E_WORKERS`
  - `E2E_SEED_MANIFEST`
  - `E2E_MAIL_CAPTURE_DIR`

### Mail Capture

- If `E2E_MAIL_CAPTURE_DIR` is set, mails are rendered and written as JSON artifacts instead of being sent via SMTP.
- This is used by E2E tests to validate invite email content and links without external delivery.

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

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
  - Configure outbound delivery + logging
  - `EMAIL_DELIVERY_ENABLED`=`false` (set to `true` only in production)
  - `EMAIL_FROM`="moin@party-starter.de"
  - `SMTP_URL`="smtp://[user]:[password]@sandbox.smtp.mailtrap.io:[port]"
  - **Allowlist**: When `EMAIL_DELIVERY_ENABLED` is `false`, you can still deliver emails to specific recipients by adding patterns to the allowlist at `/admin/emails/settings`. Use `*` as wildcard (e.g. `*@example.com`, `dev@company.de`).
- `pnpm db:push` to push schema to DB
- Cron Jobs
  - Add cron jobs to [crons.ts](src/super-cron/crons.ts)
  - Set `isActive` to `true` to activate the cron job
  - Add `/api/cron/{cronName}` to your app (see [test cron](src/app/api/cron/test/route.ts)) for an example
  - Run `pnpm install` to sync the cron jobs to vercel.json
  - Add an Environment Variable `CRON_SECRET` to your app
    - If you use [Gitenvs](https://www.npmjs.com/package/gitenvs) and Vercel you need to set the `CRON_SECRET` directly in Vercel not in Gitenvs

## Neon Branches (Dev)

These commands are intended for human local development.

- `pnpm neon:dev:use`: create-or-reset your `dev/<username>` branch from `production` and update `DATABASE_URL`
- `pnpm neon:dev:env`: only update `DATABASE_URL` for your branch (no create/reset)
- `pnpm neon:prod:env`: set `DATABASE_URL` to the `production` branch
- `pnpm neon:dev:create` / `pnpm neon:dev:reset` / `pnpm neon:dev:delete`: explicit branch actions
- `pnpm neon:dev:seed`: delete `dev/<username>`, recreate schema-only, set `DATABASE_URL`, run `pnpm db:push`, then `pnpm e2e:seed`
- override target with `--username <name>` or `--branch <branch-name>`
- destructive commands (`sync`, `reset`, `delete`) now refuse protected/default branches by name and Neon metadata checks
- add extra protected branch names with `NEON_PROTECTED_BRANCHES="production,main"`
- emergency bypass exists via `--unsafe-allow-protected` (not recommended)

### Protect production branch in Neon

- In Neon Console, open your `production` branch and enable **Protected branch**
- Recommended because it blocks dangerous branch-level actions such as reset/delete on that branch
- Existing workflow impact:
  - `pnpm neon:dev:*` commands for `dev/<username>` continue to work
  - `pnpm neon:prod:env` continues to work (it only reads connection info)
  - `pnpm db:push` still works as long as `DATABASE_URL` has valid credentials for the target branch
- If branch password is enabled for protected branches in Neon, ensure your `DATABASE_URL` includes valid credentials

## E2E Testing

This template has a dual-mode Playwright setup:

- CI mode (`next build` + `next start`) with a dedicated schema-only Neon branch per run
- Dev mode (`next dev`) for fast local iteration without forced branch lifecycle

### Policy (AI agents vs humans)

- AI agents should run E2E checks with `pnpm e2e:ci`.
- `pnpm e2e:dev` is intended for humans doing interactive local debugging.
- `pnpm neon:dev:*` commands are human workflows and should not be required for agent E2E verification.

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
  - pick an available localhost port for the run (override with `E2E_PORT`)
  - Playwright run (`playwright.ci.config.ts`)
  - branch cleanup (delete, plus expiration fallback)
- Small/targeted CI runs (useful for agents):
  - `E2E_WORKERS=1 pnpm e2e:ci -- e2e/specs/org-members.spec.ts`
  - `E2E_WORKERS=1 pnpm e2e:ci -- --grep "impersonate"`

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
  - `EMAIL_DELIVERY_ENABLED` (forced to `false` by the E2E runner)

### Mail Capture

- All generated mails are persisted in the `email_log` table.
- E2E tests poll `email_log` directly to validate invite/auth email content and links.
- You can inspect mails in the admin UI at `/admin/emails`.

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

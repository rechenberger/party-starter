After making any file edits and before finishing, run `pnpm format` to keep formatting clean.
Before finishing, run the smallest relevant verification for changed files (for example: `pnpm lint`, `pnpm ts:check`, or `E2E_WORKERS=1 pnpm e2e:ci -- <spec-file>`).

## Human vs. Agent Workflow

- `pnpm e2e:dev` is for humans only (manual local debugging/iteration).
- AI agents must use `pnpm e2e:ci` for E2E verification.
- For small agent iterations, run a scoped CI E2E command:
  - `E2E_WORKERS=1 pnpm e2e:ci -- e2e/specs/<spec-file>.ts`
  - `E2E_WORKERS=1 pnpm e2e:ci -- --grep "<pattern>"`
- `pnpm neon:dev:*` branch workflows are for human local development, not agent verification.

## Agent Feature Workflow

- Prefer additive, non-breaking DB schema changes in PRs so `pnpm db:push` stays safe (avoid destructive drops/renames unless explicitly requested).
- For feature work, agents should add or update automated tests (usually E2E), run them, and prefer seeded E2E data (`pnpm e2e:seed`) instead of manual setup.
- `pnpm e2e:ci` is stateless for agents: it creates a fresh Neon test branch, runs `pnpm db:push` and `pnpm e2e:seed`, then cleans up. Agents should not do that setup manually.

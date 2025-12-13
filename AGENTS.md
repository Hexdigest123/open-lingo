# Repository Guidelines

## Project Structure & Module Organization
- SvelteKit app with routes in `src/routes`, grouped into `(public)`, `(protected)`, and `(admin)` layouts plus shared styles in `src/routes/layout.css`.
- UI pieces live in `src/lib/components`; shared data in `src/lib/data`; translations in `src/lib/i18n/*.json` and re-exported via `src/lib/index.ts`.
- Server-side helpers are under `src/lib/server` (auth, JWT/password utilities). Database client and schema live in `src/lib/server/db/index.ts` and `schema.ts`.
- Database migrations reside in `drizzle/` with config in `drizzle.config.ts`; seed script is `scripts/seed.ts`.
- Tests: unit/spec examples sit near source such as `src/demo.spec.ts`; Playwright E2E specs live in `e2e/`.

## Environment & Data
- Copy `.env.example` to `.env` and set `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `ENCRYPTION_KEY` (generate secrets with `openssl rand` as noted in the example).
- Start local Postgres with `npm run db:start` (uses `compose.yaml`). Apply schema via `npm run db:push` or `npm run db:migrate`; seed fixtures with `npm run db:seed`.

## Build, Test, and Development Commands
- Install dependencies: `npm install`.
- Dev server with hot reload: `npm run dev` (`npm run dev -- --open` to auto-open a tab).
- Type and Svelte checks: `npm run check`.
- Lint/format: `npm run lint`; auto-format: `npm run format`.
- Unit tests (Vitest): `npm run test:unit`; full suite (`test:e2e` then `test:unit -- --run`): `npm run test`.
- E2E (Playwright): `npm run test:e2e` (ensure dev server and database are running).

## Coding Style & Naming Conventions
- Prettier + ESLint enforce 2-space, Svelte/TypeScript-friendly formatting; run `npm run format` before commits.
- Svelte components use PascalCase filenames; utilities/types use camelCase; route files follow the SvelteKit `+page.svelte` / `+page.server.ts` pattern.
- Keep locale keys consistent across `src/lib/i18n/*.json`; export shared modules through `src/lib/index.ts`.
- Database changes should include matching Drizzle migration files under `drizzle/`.

## Testing Guidelines
- Write Vitest specs alongside the code using `*.spec.ts`; mock external services and prepare predictable seed data where possible.
- Extend Playwright scenarios in `e2e/`, preferring data-testids over brittle selectors.
- Run `npm run test` (or `npm run check` plus targeted suites) before opening a PR; document known flakes or skipped cases in the PR description.

## Commit & Pull Request Guidelines
- The repository history is empty; adopt concise, imperative subjects—prefer Conventional Commit prefixes (`feat: add lesson generator`, `fix: auth token refresh`) for clarity.
- PRs should describe scope, link related issues, note environment or database changes, and include test evidence (commands run and UI screenshots for visual updates).
- Include migration or seed notes when schema or fixtures change, and avoid committing `.env` files or local database dumps.

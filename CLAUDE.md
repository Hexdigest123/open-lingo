# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev              # Start dev server with HMR
npm run build            # Production build
npm run preview          # Preview production build
```

### Testing
```bash
npm run test             # Run all tests (E2E + unit)
npm run test:unit        # Run Vitest unit tests only
npm run test:e2e         # Run Playwright E2E tests

# Run a single unit test file
npx vitest src/demo.spec.ts

# Run a single E2E test
npx playwright test e2e/demo.test.ts
```

### Database (PostgreSQL via Docker)
```bash
npm run db:start         # Start PostgreSQL container
npm run db:push          # Push schema changes to database
npm run db:generate      # Generate migration files
npm run db:migrate       # Run pending migrations
npm run db:studio        # Open Drizzle Studio GUI
npm run db:seed          # Seed database with initial data
```

### Code Quality
```bash
npm run check            # TypeScript + Svelte type checking
npm run lint             # ESLint + Prettier check
npm run format           # Auto-format with Prettier
```

## Architecture

**Stack:** SvelteKit + Svelte 5 + TypeScript + Tailwind CSS v4 + Drizzle ORM + PostgreSQL

### Route Structure
```
src/routes/
├── (public)/            # Public routes (landing, login, register)
├── (protected)/         # Auth-required routes (dashboard, lessons, profile)
├── (admin)/             # Admin-only routes
└── api/                 # API endpoints (auth, lessons, openai)
```

### Key Paths
- `src/routes/` - SvelteKit file-based routing with route groups
- `src/lib/components/` - Reusable Svelte components
- `src/lib/stores/` - Svelte 5 rune-based state management
- `src/lib/server/` - Server-only code (never sent to client)
- `src/lib/server/db/schema.ts` - Drizzle database schema (13 tables)
- `src/lib/server/auth/` - Authentication utilities (JWT, bcrypt, encryption)
- `scripts/seed.ts` - Database seed script

### Database Schema
Key tables: `users`, `refresh_tokens`, `levels`, `units`, `lessons`, `questions`, `user_stats`, `user_lesson_progress`, `achievements`, `leaderboard_cache`

### Authentication
- JWT access tokens (15min) + refresh tokens (7 days)
- Refresh tokens stored as httpOnly cookies
- Session validation in `src/hooks.server.ts`
- Route guards in layout server files

### Styling
Duolingo-inspired color theme in `src/routes/layout.css`:
- Success (green): `--color-success: #58cc02`
- Error (red): `--color-error: #ff4b4b`
- Primary (blue): `--color-primary: #1cb0f6`
- XP (yellow): `--color-yellow: #ffc800`
- Streak (orange): `--color-orange: #ff9600`

### Environment Variables
Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_ACCESS_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `ENCRYPTION_KEY` - 64-char hex key for OpenAI API key encryption
- Always make sure dev, build and docker build works

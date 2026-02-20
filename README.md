# OpenLingo

A Duolingo-inspired Spanish language learning application with AI-powered features.

## Features

- **Lesson System**: Structured lessons organized by CEFR levels (A1-C2), units, and progressive difficulty
- **Question Types**: Multiple choice, fill-in-the-blank, translation, matching, word ordering, speaking, and listening exercises
- **AI Integration**:
  - AI-powered explanations for incorrect answers
  - Text-to-speech for pronunciation
  - Speech evaluation for speaking exercises
  - Voice chat with OpenAI Realtime API
- **Gamification**: XP system, hearts/lives, streaks, achievements, and leaderboards
- **Multi-language UI**: English and German interface support
- **User Management**: Role-based access (user/admin), invitation codes, approval workflows
- **Admin Panel**: Lesson management, AI-assisted lesson generation, user administration, API usage tracking

## Tech Stack

- **Frontend**: SvelteKit, Svelte 5, TypeScript, Tailwind CSS v4
- **Backend**: SvelteKit (Node adapter), Drizzle ORM
- **Database**: PostgreSQL
- **Authentication**: JWT access tokens + refresh tokens (httpOnly cookies)
- **AI**: OpenAI API (GPT-4, Whisper, TTS, Realtime API)

## Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- OpenAI API key (optional, for AI features)

## Quick Start

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd open-lingo
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Required variables:

   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/openlingo
   JWT_ACCESS_SECRET=<random-64-char-string>
   JWT_REFRESH_SECRET=<random-64-char-string>
   ENCRYPTION_KEY=<random-64-char-hex-string>
   ```

   Optional (for AI features):

   ```env
   OPENAI_API_KEY=sk-...
   ```

   Optional (for email notifications):

   ```env
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=user@example.com
   SMTP_PASS=password
   SMTP_FROM=OpenLingo <noreply@example.com>
   PUBLIC_APP_URL=https://your-domain.com
   ```

3. **Start the database**

   ```bash
   npm run db:start
   ```

4. **Initialize the database**

   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open the app**

   Navigate to `http://localhost:5173`

## Available Scripts

### Development

```bash
npm run dev              # Start dev server with HMR
npm run build            # Production build
npm run preview          # Preview production build
npm run check            # TypeScript + Svelte type checking
npm run lint             # ESLint + Prettier check
npm run format           # Auto-format with Prettier
```

### Testing

```bash
npm run test             # Run all tests (E2E + unit)
npm run test:unit        # Run Vitest unit tests only
npm run test:e2e         # Run Playwright E2E tests
```

### Database

```bash
npm run db:start         # Start PostgreSQL container
npm run db:push          # Push schema changes to database
npm run db:generate      # Generate migration files
npm run db:migrate       # Run pending migrations
npm run db:studio        # Open Drizzle Studio GUI
npm run db:seed          # Seed database with initial data
```

## Project Structure

```
src/
├── lib/
│   ├── components/      # Reusable Svelte components
│   │   ├── admin/       # Admin-specific components
│   │   └── lessons/     # Question type components
│   ├── i18n/            # Internationalization (en.json, de.json)
│   ├── server/          # Server-only code
│   │   ├── auth/        # JWT, password hashing, encryption
│   │   ├── db/          # Drizzle schema and connection
│   │   ├── email/       # Nodemailer email service
│   │   ├── openai/      # OpenAI API integration
│   │   └── settings/    # App configuration management
│   └── stores/          # Svelte 5 rune-based state
├── routes/
│   ├── (public)/        # Public routes (login, register)
│   ├── (protected)/     # Auth-required routes (dashboard, lessons)
│   ├── (admin)/         # Admin-only routes
│   └── api/             # API endpoints
└── hooks.server.ts      # Auth middleware
```

## Database Schema

Key tables:

- `users` - User accounts with roles and approval status
- `levels`, `units`, `lessons` - Content hierarchy
- `questions` - Lesson questions with JSON content
- `user_stats` - XP, streaks, hearts
- `user_lesson_progress` - Completion tracking
- `achievements` - Gamification badges
- `leaderboard_cache` - Cached rankings
- `api_usage_logs` - AI feature usage tracking
- `user_api_keys` - Encrypted user OpenAI keys

## Authentication

- JWT access tokens (15-minute expiry)
- Refresh tokens stored as httpOnly cookies (7-day expiry)
- Session validation in server hooks
- Route guards in layout server files

## Signup Modes

Configurable in admin settings:

- **Open**: Anyone can register
- **Invitation**: Requires invite code from admin
- **Approval**: Requires admin approval after registration

## API Key Management

Users can:

1. Use their own OpenAI API key (stored encrypted)
2. Use a global API key set by admin (if configured)

AI features are disabled if no key is available.

## Security

- Passwords hashed with bcrypt
- API keys encrypted with AES-256-GCM
- Open redirect protection on login
- Session ownership validation
- Input validation with Zod
- XSS prevention in email templates

See [ENDPOINTS.md](./ENDPOINTS.md) for detailed security analysis.

## Docker Deployment

```bash
# Build the image
docker build -t open-lingo .

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL=postgres://... \
  -e JWT_ACCESS_SECRET=... \
  -e JWT_REFRESH_SECRET=... \
  -e ENCRYPTION_KEY=... \
  open-lingo
```

## License

Private project.

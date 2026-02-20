# SERVER SERVICE LAYER

Server-only modules imported via `$lib/server/{domain}`. Each subdirectory is a single-concern service.

## STRUCTURE

```
server/
├── auth/           # JWT tokens, password hashing, encryption, session management
├── db/             # Drizzle client singleton + schema (source of truth for all tables)
├── validation/     # Zod schemas + answer normalization + question content validation
├── security/       # In-memory rate limiting (sliding window)
├── email/          # Nodemailer SMTP transport
├── openai/         # API key resolution (user-encrypted vs global)
├── settings/       # app_settings table get/set (signup mode, global API key, etc.)
├── hearts/         # Hearts feature flag check
├── invitations/    # Invitation code generation + validation
└── audit/          # API usage logging (token counts, model tracking)
```

## WHERE TO LOOK

| Task                            | File                                | Notes                                                              |
| ------------------------------- | ----------------------------------- | ------------------------------------------------------------------ |
| Add DB table/column             | `db/schema.ts`                      | Add table + relations + type exports. Run `db:generate`            |
| Auth token logic                | `auth/jwt.ts`                       | `signAccessToken`, `signRefreshToken`, `verifyAccessToken`         |
| Session create/refresh/validate | `auth/session.ts`                   | `createSession`, `refreshSession`, `validateAccessToken`           |
| Password operations             | `auth/password.ts`                  | bcrypt hash + verify                                               |
| Encrypt/decrypt user API keys   | `auth/encryption.ts`                | AES-256-GCM via `ENCRYPTION_KEY` env                               |
| Validate form inputs            | `validation/input.ts`               | Zod schemas for login, register, profile, etc.                     |
| Validate answer correctness     | `validation/answers.ts`             | `normalizeAnswer`, `checkAnswer` with accent/case/article handling |
| Question content structure      | `validation/question-validation.ts` | Per-type content shape validation                                  |
| Rate limit config               | `security/rateLimit.ts`             | `RATE_LIMITS` map, `checkRateLimit(id, key, config)`               |
| Send emails                     | `email/mailer.ts`                   | `sendApprovalEmail`, `sendRejectionEmail` via SMTP                 |
| Resolve OpenAI key              | `openai/getApiKey.ts`               | Checks user encrypted key first, falls back to global              |
| App-wide settings               | `settings/appSettings.ts`           | `getAppSetting(key)`, `setAppSetting(key, value)`                  |
| Log API usage                   | `audit/apiUsage.ts`                 | `logApiUsage(...)` + `extractUsageFromResponse(...)`               |

## CONVENTIONS

- **One export file per domain** - Each subdir has one main `.ts` file (no barrel `index.ts` except `db/`)
- **Direct Drizzle queries** - Import `db` from `$lib/server/db`, use query builder directly. No repository abstraction layer
- **Env access** - Use `$env/dynamic/private` for runtime env, `$env/static/private` for build-time
- **Error handling** - Services throw or return null; route handlers catch and respond with `fail()` or `error()`
- **No transactions** - Individual queries only; no `db.transaction()` wrapper pattern established
- **Schema types** - Always import types from `db/schema.ts` (`User`, `Lesson`, etc.), never re-declare

## ANTI-PATTERNS

- Do NOT import `$lib/server/*` from client-side code (SvelteKit will error)
- Do NOT create new `postgres()` connections; always use the shared `db` singleton
- Do NOT store secrets in plaintext; use `encryption.ts` for user-provided keys
- `rateLimit.ts` uses in-memory Map - state resets on server restart, not shared across instances
- Answer normalization strips accents and articles for Spanish - changes to `normalizeAnswer` affect scoring globally

# Deployment Guide

## Overview

This project uses GitHub Actions for automated deployment to a self-hosted server. The deployment system includes safety features to prevent accidental data loss while still allowing controlled re-seeding when needed.

---

## Deployment Methods

### 1. Automatic Deployment (Recommended)

**Trigger:** Push to `main` branch

```bash
git push origin main
```

**What happens:**

- ✅ Applies database migrations (safe)
- ✅ Only seeds if database is empty
- ✅ Never wipes existing data
- ✅ Rebuilds and restarts the app

**Use for:** Regular development workflow, production updates

---

### 2. Manual Deployment (Safe)

**When to use:** Deploy without pushing code

**Steps:**

1. Go to **GitHub** → **Actions** tab
2. Click **Deploy** workflow
3. Click **Run workflow** button
4. Leave the checkbox **unchecked**
5. Click green **Run workflow** button

**Result:** Same as automatic deployment - safe for production

---

### 3. Force Re-seed Deployment ⚠️

**When to use:**

- Content/vocabulary updates
- Testing environments
- Staging resets
- **NEVER on production with users!**

**Steps:**

1. Go to **GitHub** → **Actions** tab
2. Click **Deploy** workflow
3. Click **Run workflow** button
4. **✅ Check** the box: "⚠️ DANGER: Force re-seed database (DELETES ALL DATA!)"
5. Click green **Run workflow** button
6. Confirm you understand data will be lost

**Result:**

- ❌ **Deletes ALL data** (users, progress, everything)
- ✅ Seeds fresh content (6 levels, 28 units, 588 lessons, 26,957 questions)

---

## Visual Guide: Manual Deployment

### Safe Deploy (No Data Loss)

```
GitHub → Actions → Deploy → Run workflow
                                  ↓
          [ ] ⚠️ DANGER: Force re-seed database
                                  ↓
                         Run workflow button
                                  ↓
                         ✅ Safe deployment
```

### Force Re-seed (DATA LOSS)

```
GitHub → Actions → Deploy → Run workflow
                                  ↓
          [✓] ⚠️ DANGER: Force re-seed database
                                  ↓
                         Run workflow button
                                  ↓
                    ⚠️ Warning displayed
                                  ↓
                    ❌ ALL DATA DELETED
                                  ↓
                    ✅ Fresh content seeded
```

---

## What Gets Seeded

When seeding occurs (either automatically on empty DB or forced), you get:

| Type             | Count  | Details                                          |
| ---------------- | ------ | ------------------------------------------------ |
| **Levels**       | 6      | A1, A2, B1, B2, C1, C2 (CEFR)                    |
| **Units**        | 28     | 10 (A1), 10 (A2), 4 (B1), 2 (B2), 1 (C1), 1 (C2) |
| **Lessons**      | 588    | 20 regular + 1 exam per unit                     |
| **Questions**    | 26,957 | 50 per lesson, 10 per exam                       |
| **Achievements** | 23     | Progress tracking achievements                   |

**Content:**

- Multiple choice, fill-in-blank, translation
- Matching, word order, speaking, listening
- Bilingual support (English/German)
- Static pre-generated questions (consistent)

---

## Database Operations

### Migrations vs Seeding

| Operation     | Command            | Safety         | Purpose            |
| ------------- | ------------------ | -------------- | ------------------ |
| **Migration** | `drizzle-kit push` | ✅ Safe        | Schema changes     |
| **Seeding**   | `npm run db:seed`  | ⚠️ Destructive | Initial/fresh data |

**Migrations:**

- Add/modify tables and columns
- Preserve all existing data
- Run automatically on every deploy
- **Always safe to run**

**Seeding:**

- Populate empty database
- **Wipes everything first**
- Static content from JSON file
- **Dangerous on existing systems**

---

## Safety Features

1. **Smart Detection**
   - Checks if `levels` table has data
   - Auto-seeds only if empty
   - Never surprises you with data loss

2. **Manual Override**
   - Force seed requires explicit checkbox
   - Clear warning messages
   - OFF by default

3. **Visual Warnings**
   - Workflow shows ⚠️ banner
   - 3-second delay with warning text
   - Lists exactly what will be deleted

---

## Common Scenarios

### Scenario 1: First Deployment

```bash
# Database: Empty
# Action: Automatic seed
# Result: ✅ Fresh system ready to use
```

### Scenario 2: Code Update

```bash
git commit -m "fix: update UI"
git push origin main

# Database: Has users and data
# Action: Migrations only
# Result: ✅ Updated code, all data preserved
```

### Scenario 3: Schema Change

```bash
# Edit src/lib/server/db/schema.ts
git commit -m "feat: add new user field"
git push origin main

# Database: Has users and data
# Action: Migration applied
# Result: ✅ Schema updated, all data preserved
```

### Scenario 4: Content Update

```bash
# Updated vocabulary in static-seed-data.json
# Want to deploy new lessons

# Action: Manual deploy with force_seed=true
# Result: ⚠️ ALL data deleted, new content loaded

# ⚠️ Only do this in dev/staging!
```

---

## Local Development

### Setup Fresh Database

```bash
npm run db:start     # Start PostgreSQL with podman/docker
npm run db:push      # Apply schema (--force to skip prompt)
npm run db:seed      # Seed content (wipes data!)
```

### Apply Schema Changes

```bash
npm run db:generate  # Generate migration files (optional)
npm run db:push      # Apply schema directly
```

### Reset Database

```bash
podman compose down -v  # or: docker compose down -v
npm run db:start
npm run db:push
npm run db:seed
```

---

## Production Checklist

Before deploying to production:

- [ ] Test in staging environment first
- [ ] Verify migrations don't break existing features
- [ ] **Never** use force_seed with real users
- [ ] Have database backup ready
- [ ] Review deployment logs
- [ ] Monitor app health after deploy

---

## Rollback Procedure

If deployment fails:

1. **App won't start:**

   ```bash
   # SSH to server
   docker compose logs app --tail=100
   # Fix issue and redeploy
   ```

2. **Database migration failed:**

   ```bash
   # Check what was applied
   docker compose exec db psql -U root -d local
   SELECT * FROM drizzle.__drizzle_migrations;

   # Manual rollback if needed
   # Restore from backup
   ```

3. **Accidental force seed:**

   ```bash
   # Restore from backup (if you have one)
   docker compose exec -T db psql -U root -d local < backup.sql

   # Otherwise, users must re-register
   ```

---

## Troubleshooting

### "LEVEL_COUNT: 0" but data exists

**Problem:** Levels table empty but other data exists

**Solution:**

```bash
# Option 1: Force re-seed (loses data)
# Use GitHub Actions with force_seed=true

# Option 2: Keep other data, manually fix
docker compose exec db psql -U root -d local
# Manually insert missing levels
```

### Workflow shows "needs_seed=false" but should seed

**Problem:** Levels exist but want to update content

**Solution:**

- Use force_seed=true checkbox in GitHub Actions

### Cannot connect to database

**Problem:** Database container not healthy

**Solution:**

```bash
# Check container status
docker compose ps

# View database logs
docker compose logs db

# Restart database
docker compose restart db
```

---

## Environment Variables

Required secrets (set in GitHub repository settings):

```env
# Database
POSTGRES_USER=root
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=local

# Authentication
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ENCRYPTION_KEY=your_encryption_key

# Email (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
SMTP_FROM=noreply@example.com

# Legal (optional)
LEGAL_COMPANY_NAME=Your Company
LEGAL_EMAIL=legal@example.com
# ... more legal fields
```

---

## Support

- **Documentation:** See `.github/workflows/README.md`
- **Seed Details:** See `scripts/README.md`
- **Database Schema:** See `src/lib/server/db/schema.ts`

---

## Quick Reference

| Task           | Command                                                  |
| -------------- | -------------------------------------------------------- |
| Deploy code    | `git push origin main`                                   |
| Force re-seed  | GitHub Actions UI → check box                            |
| Local setup    | `npm run db:start && npm run db:push && npm run db:seed` |
| View logs      | `docker compose logs -f app`                             |
| Database shell | `docker compose exec db psql -U root -d local`           |
| Check status   | `docker compose ps`                                      |
| Restart app    | `docker compose restart app`                             |

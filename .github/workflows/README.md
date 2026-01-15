# GitHub Actions Workflows

## Deploy Workflow

The `deploy.yml` workflow handles automated deployment to your self-hosted server.

### Automatic Deployment (Push to Main)

**Triggered by:** Push to `main` branch

**Behavior:**

- ✅ Runs migrations (safe - preserves data)
- ✅ Only seeds if database is empty (checks `levels` table)
- ✅ **Never wipes data** on existing systems
- ✅ Rebuilds and restarts the app

**Use case:** Normal development workflow - safe for production

---

## Manual Deployment Options

### Option 1: Normal Manual Deploy

**How to trigger:**

1. Go to **Actions** tab in GitHub
2. Select **Deploy** workflow
3. Click **Run workflow**
4. Leave "Force re-seed database" **unchecked**
5. Click **Run workflow**

**Behavior:**

- Same as automatic deployment
- Safe for production
- Preserves all user data

---

### Option 2: Force Re-seed Deploy ⚠️ DANGER

**How to trigger:**

1. Go to **Actions** tab in GitHub
2. Select **Deploy** workflow
3. Click **Run workflow**
4. **Check** the box: "⚠️ DANGER: Force re-seed database (DELETES ALL DATA!)"
5. Click **Run workflow**

**Behavior:**

- ⚠️ **DELETES ALL DATA** in the database
- Re-seeds fresh content:
  - 6 CEFR Levels (A1-C2)
  - 28 Units
  - 588 Lessons
  - 26,957 Questions
  - 23 Achievements

**⚠️ WARNING - Data Loss:**

This will permanently delete:

- ❌ All user accounts and profiles
- ❌ User progress and lesson completions
- ❌ User stats (XP, streaks, hearts)
- ❌ Earned achievements
- ❌ Chat sessions and history
- ❌ All user-generated data

**When to use:**

- 🔧 Testing and development environments
- 🔄 After major content/vocabulary updates
- 🆕 Resetting a staging environment
- 🐛 Fixing corrupted seed data

**When NOT to use:**

- ❌ **NEVER on production with real users**
- ❌ When users have active accounts
- ❌ When you want to preserve progress

---

## Deployment Scenarios

### Scenario 1: First Time Deployment

```
✅ Database: Empty
✅ Behavior: Auto-seeds (no option needed)
✅ Result: Fresh system with all content
```

### Scenario 2: Regular Update (Code Changes)

```
✅ Database: Has data
✅ Trigger: Push to main
✅ Behavior: Migrations only (safe)
✅ Result: Updated code, preserved data
```

### Scenario 3: Content Update (New Lessons)

```
⚠️  Database: Has data
⚠️  Trigger: Manual deploy with force_seed=true
⚠️  Behavior: Wipes and re-seeds
⚠️  Result: Fresh content, ALL USER DATA LOST
```

---

## Safety Features

1. **Manual Only** - Force seed requires explicit manual trigger
2. **Clear Warning** - Workflow shows warning banner before seeding
3. **Default Safe** - Force seed is OFF by default
4. **No Auto-Wipe** - Push to main never force-seeds

---

## Best Practices

### Development Workflow

```bash
# Local development
npm run db:push     # Apply schema changes
npm run db:seed     # Seed when needed (wipes local data)

# Deploy to staging
git push origin main  # Safe - only seeds if empty

# Force re-seed staging
# Use GitHub Actions UI with force_seed=true
```

### Production Workflow

```bash
# Deploy code changes
git push origin main  # Safe - preserves all data

# Deploy schema changes
git push origin main  # Safe - migrations preserve data

# ⚠️ NEVER use force_seed in production with users!
```

---

## Troubleshooting

### "Database needs seeding" but data exists

**Cause:** The `levels` table is empty but other data exists.

**Solution:**

1. Check database state
2. If corruption, use force_seed to reset
3. Or manually insert levels and keep other data

### Force seed not working

**Cause:** Workflow input not passed correctly.

**Solution:**

1. Ensure you checked the box in GitHub UI
2. Check workflow logs for "FORCE SEED ENABLED"
3. Verify the warning message appears

### Accidental force seed in production

**Prevention:**

- Review the checkbox carefully before running
- Use separate repositories for staging/production
- Implement additional approval steps for production

**Recovery:**

- Restore from database backup
- Users will need to re-register if no backup exists

---

## Migration vs. Seeding

| Operation      | Command            | Data Safety    | When to Use                    |
| -------------- | ------------------ | -------------- | ------------------------------ |
| **Migrations** | `drizzle-kit push` | ✅ Safe        | Schema changes                 |
| **Seeding**    | `npm run db:seed`  | ⚠️ Destructive | Fresh setup or content updates |

---

## Questions?

- Migrations safe? **Yes** - Always safe, preserves data
- Auto-deploy safe? **Yes** - Only seeds empty databases
- Force seed safe? **No** - Deletes ALL data
- Can I undo force seed? **No** - Use database backups

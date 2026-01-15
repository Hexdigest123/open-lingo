# Database Seeding Scripts

This directory contains scripts for seeding the database with lesson content.

## Overview

The seeding system now uses **static pre-generated data** instead of dynamically generating questions on each seed run. This ensures:

- ✅ **Consistency** - Same questions every time
- ✅ **Speed** - Much faster seeding (no question generation overhead)
- ✅ **Reproducibility** - Predictable behavior across environments
- ✅ **Version Control** - Question content can be tracked in git

## Files

### `seed.ts`

The main seed script that loads data from `static-seed-data.json` and inserts it into the database.

**⚠️ WARNING:** This script **DELETES ALL EXISTING DATA** before seeding!

### `static-seed-data.json`

Pre-generated static seed data containing:

- 6 CEFR Levels (A1-C2)
- 28 Units across all levels
- 588 Lessons (20 lessons + 1 exam per unit)
- 26,957 Questions (50 per regular lesson, 10 per exam)
- 23 Achievements

**Size:** ~11 MB

### `generate-static-seed.ts`

Script used to generate `static-seed-data.json`. You typically don't need to run this unless you want to regenerate the questions with different content.

## Usage

### Standard Seeding (Wipes Database)

```bash
# Ensure database is running
npm run db:start

# Run migrations first
npm run db:migrate

# Seed the database (DELETES ALL DATA)
npm run db:seed
```

### Regenerating Static Seed Data

If you need to regenerate the static seed data (e.g., vocabulary changes):

```bash
# Generate new static seed data
npx tsx scripts/generate-static-seed.ts

# Review the generated file
ls -lh scripts/static-seed-data.json

# Then run normal seeding
npm run db:seed
```

## Database Content

After seeding, you'll have:

### A1 Level (Beginner) - 10 Units

1. Greetings & Introductions
2. Numbers 1-100
3. Family
4. Colors
5. Food & Drink
6. Days & Time
7. Body Parts
8. Clothing
9. House & Home
10. Common Verbs

### A2 Level (Elementary) - 10 Units

1. Weather & Seasons
2. Travel & Transport
3. Shopping
4. Health & Body
5. Work & Professions
6. Education
7. Sports & Hobbies
8. City & Places
9. Nature & Animals
10. Emotions & Feelings

### B1 Level (Intermediate) - 4 Units

1. Past Tense Verbs
2. Future Plans
3. Technology
4. Environment

### B2 Level (Upper Intermediate) - 2 Units

1. Politics & Society
2. Business & Finance

### C1 Level (Advanced) - 1 Unit

1. Academic Writing

### C2 Level (Mastery) - 1 Unit

1. Idiomatic Expressions

## Question Types

Each regular lesson contains 50 questions with the following distribution:

- 10 Multiple Choice
- 10 Fill in the Blank
- 8 Translation
- 6 Matching
- 6 Word Order
- 5 Speaking (requires OpenAI API)
- 5 Listening (requires OpenAI API)

Each exam contains 10 questions:

- 2 Multiple Choice
- 2 Fill in the Blank
- 2 Translation
- 2 Matching
- 2 Word Order

## Bilingual Support

All content includes both English and German translations:

- Questions show instructions in user's locale
- Hints and feedback adapt to user's language
- Stored as JSON: `{"en": "...", "de": "..."}`

## Important Notes

1. **Data Loss Warning:** Running `npm run db:seed` will **DELETE ALL EXISTING DATA** including:
   - User progress
   - User stats
   - Achievements earned
   - Question attempts
   - Chat sessions

   Only use in development or fresh deployments!

2. **Migrations vs Seeding:**
   - Migrations (`npm run db:migrate`) are **SAFE** and preserve data
   - Seeding (`npm run db:seed`) **WIPES DATA** and reinserts fresh content

3. **Production Use:**
   - Run migrations in production: ✅ Safe
   - Run seeding in production: ❌ Only on initial setup

## Troubleshooting

### "Static seed data file not found"

```bash
# Generate the static seed data first
npx tsx scripts/generate-static-seed.ts
```

### Seeding is slow

The script processes questions in batches of 100 for performance. On a local database, seeding ~27k questions should take under 30 seconds.

### Questions are different on each seed

This shouldn't happen anymore since we use static data. If questions change, someone has regenerated the `static-seed-data.json` file.

### Want to add new content

1. Update vocabulary in `src/lib/data/spanish-vocabulary.ts`
2. Regenerate static seed: `npx tsx scripts/generate-static-seed.ts`
3. Commit the new `static-seed-data.json` file
4. Seed the database: `npm run db:seed`

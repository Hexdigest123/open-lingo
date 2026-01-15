import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/lib/server/db/schema';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { levels, units, lessons, questions, achievements } = schema;

async function seed() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error('DATABASE_URL is not set');
	}

	const client = postgres(databaseUrl);
	const db = drizzle(client, { schema });

	console.log('🌱 Starting database seed from static data...\n');

	// Load static seed data
	const seedDataPath = path.join(__dirname, 'static-seed-data.json');
	console.log(`📂 Loading static seed data from: ${seedDataPath}`);

	if (!fs.existsSync(seedDataPath)) {
		throw new Error(
			`Static seed data file not found at ${seedDataPath}.\n` +
				'Please run: npx tsx scripts/generate-static-seed.ts'
		);
	}

	const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));
	console.log('   ✓ Static seed data loaded\n');

	// Clear existing data (will cascade delete related records)
	console.log('🗑️  Clearing existing data...');
	await db.delete(questions);
	await db.delete(lessons);
	await db.delete(units);
	await db.delete(levels);
	await db.delete(achievements);
	console.log('   ✓ Existing data cleared\n');

	// Seed CEFR Levels
	console.log('📚 Seeding CEFR levels...');
	const insertedLevels = await db.insert(levels).values(seedData.levels).returning();
	console.log(`   ✓ Inserted ${insertedLevels.length} levels\n`);

	// Create level map for lookup
	const levelMap = new Map(insertedLevels.map((l) => [l.code, l.id]));

	// Seed Units
	console.log('📁 Seeding units...');
	const unitsWithLevelIds = seedData.units.map((unit: any) => ({
		...unit,
		levelId: levelMap.get(unit.levelCode)
	}));

	const insertedUnits = await db.insert(units).values(unitsWithLevelIds).returning();
	console.log(`   ✓ Inserted ${insertedUnits.length} units\n`);

	// Create unit map for lookup (old id -> new id)
	const unitIdMap = new Map<number, number>();
	seedData.units.forEach((unit: any, index: number) => {
		unitIdMap.set(unit.id, insertedUnits[index].id);
	});

	// Seed Lessons in batches (for performance)
	console.log('📖 Seeding lessons...');
	const batchSize = 100;
	const totalLessons = seedData.lessons.length;
	let processedLessons = 0;

	const lessonIdMap = new Map<number, number>();

	for (let i = 0; i < seedData.lessons.length; i += batchSize) {
		const batch = seedData.lessons.slice(i, i + batchSize);
		const lessonsWithUnitIds = batch.map((lesson: any) => {
			const { id, ...lessonData } = lesson;
			return {
				...lessonData,
				unitId: unitIdMap.get(lesson.unitId)
			};
		});

		const insertedBatch = await db.insert(lessons).values(lessonsWithUnitIds).returning();

		// Map old lesson IDs to new ones
		batch.forEach((lesson: any, index: number) => {
			lessonIdMap.set(lesson.id, insertedBatch[index].id);
		});

		processedLessons += insertedBatch.length;
		process.stdout.write(`   Progress: ${processedLessons}/${totalLessons} lessons...\r`);
	}
	console.log(`\n   ✓ Inserted ${totalLessons} lessons\n`);

	// Seed Questions in batches (for performance)
	console.log('❓ Seeding questions...');
	const totalQuestions = seedData.questions.length;
	let processedQuestions = 0;

	for (let i = 0; i < seedData.questions.length; i += batchSize) {
		const batch = seedData.questions.slice(i, i + batchSize);
		const questionsWithLessonIds = batch.map((question: any) => {
			const { id, ...questionData } = question;
			return {
				...questionData,
				lessonId: lessonIdMap.get(question.lessonId)
			};
		});

		await db.insert(questions).values(questionsWithLessonIds);

		processedQuestions += batch.length;
		process.stdout.write(`   Progress: ${processedQuestions}/${totalQuestions} questions...\r`);
	}
	console.log(`\n   ✓ Inserted ${totalQuestions} questions\n`);

	// Seed Achievements
	console.log('🏆 Seeding achievements...');
	await db.insert(achievements).values(seedData.achievements);
	console.log(`   ✓ Inserted ${seedData.achievements.length} achievements\n`);

	// Summary
	console.log('═══════════════════════════════════════════════');
	console.log('🎉 Database seeding complete!\n');
	console.log(`📊 Summary:`);
	console.log(`   • Levels: ${insertedLevels.length}`);
	console.log(`   • Units: ${insertedUnits.length}`);
	console.log(`   • Lessons: ${totalLessons}`);
	console.log(`   • Questions: ${totalQuestions}`);
	console.log(`   • Achievements: ${seedData.achievements.length}`);
	console.log('═══════════════════════════════════════════════\n');

	// Close connection
	await client.end();
}

seed()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error('❌ Seeding failed:', error);
		process.exit(1);
	});

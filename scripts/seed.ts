import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/lib/server/db/schema';
import {
	A1_UNITS,
	A2_UNITS,
	B1_UNITS,
	B2_UNITS,
	C1_UNITS,
	C2_UNITS,
	type VocabItem,
	type UnitVocab
} from '../src/lib/data/spanish-vocabulary';
import 'dotenv/config';

const { levels, units, lessons, questions, achievements } = schema;

// Helper to shuffle an array
function shuffle<T>(array: T[]): T[] {
	const arr = [...array];
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}

// Helper to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
	const shuffled = shuffle(array);
	return shuffled.slice(0, Math.min(count, array.length));
}

// Generate multiple choice questions
function generateMultipleChoiceQuestions(
	vocabItems: VocabItem[],
	lessonId: number,
	startOrder: number,
	count: number
): schema.Question[] {
	const questions: schema.Question[] = [];
	const shuffledVocab = shuffle(vocabItems);

	for (let i = 0; i < count && i < shuffledVocab.length; i++) {
		const item = shuffledVocab[i];
		const otherItems = vocabItems.filter((v) => v.es !== item.es);
		const wrongAnswers = getRandomItems(otherItems, 3).map((v) => v.es);
		const options = shuffle([item.es, ...wrongAnswers]);

		questions.push({
			id: 0, // Will be set by DB
			lessonId,
			type: 'multiple_choice' as const,
			content: {
				question: `How do you say "${item.en}" in Spanish?`,
				options
			},
			correctAnswer: item.es,
			audioUrl: null,
			order: startOrder + i,
			createdAt: new Date()
		});
	}

	return questions;
}

// Generate fill in the blank questions
function generateFillBlankQuestions(
	vocabItems: VocabItem[],
	sentences: { es: string; en: string }[],
	lessonId: number,
	startOrder: number,
	count: number
): schema.Question[] {
	const questions: schema.Question[] = [];
	const shuffledSentences = shuffle(sentences);
	const shuffledVocab = shuffle(vocabItems);

	// Use sentences first
	let added = 0;
	for (const sentence of shuffledSentences) {
		if (added >= count) break;

		// Find a vocab word in the sentence to blank out
		for (const vocab of vocabItems) {
			if (sentence.es.toLowerCase().includes(vocab.es.toLowerCase())) {
				const blankSentence = sentence.es.replace(
					new RegExp(vocab.es, 'i'),
					'_____'
				);
				questions.push({
					id: 0,
					lessonId,
					type: 'fill_blank' as const,
					content: {
						sentence: blankSentence,
						hint: vocab.en
					},
					correctAnswer: vocab.es,
					audioUrl: null,
					order: startOrder + added,
					createdAt: new Date()
				});
				added++;
				break;
			}
		}
	}

	// If we need more, create simple fill-in-blank from vocab
	for (let i = 0; added < count && i < shuffledVocab.length; i++) {
		const item = shuffledVocab[i];
		questions.push({
			id: 0,
			lessonId,
			type: 'fill_blank' as const,
			content: {
				sentence: `The Spanish word for "${item.en}" is _____.`,
				hint: `Starts with "${item.es.charAt(0)}"`
			},
			correctAnswer: item.es,
			audioUrl: null,
			order: startOrder + added,
			createdAt: new Date()
		});
		added++;
	}

	return questions;
}

// Generate translation questions
function generateTranslationQuestions(
	vocabItems: VocabItem[],
	sentences: { es: string; en: string }[],
	lessonId: number,
	startOrder: number,
	count: number
): schema.Question[] {
	const questions: schema.Question[] = [];
	const halfCount = Math.ceil(count / 2);

	// English to Spanish translations
	const enToEsItems = getRandomItems(vocabItems, halfCount);
	for (let i = 0; i < enToEsItems.length; i++) {
		const item = enToEsItems[i];
		questions.push({
			id: 0,
			lessonId,
			type: 'translation' as const,
			content: {
				text: item.en,
				direction: 'en_to_es'
			},
			correctAnswer: item.es,
			audioUrl: null,
			order: startOrder + i,
			createdAt: new Date()
		});
	}

	// Spanish to English translations
	const esToEnItems = getRandomItems(
		vocabItems.filter((v) => !enToEsItems.includes(v)),
		count - halfCount
	);
	for (let i = 0; i < esToEnItems.length; i++) {
		const item = esToEnItems[i];
		questions.push({
			id: 0,
			lessonId,
			type: 'translation' as const,
			content: {
				text: item.es,
				direction: 'es_to_en'
			},
			correctAnswer: item.en,
			audioUrl: null,
			order: startOrder + halfCount + i,
			createdAt: new Date()
		});
	}

	return questions;
}

// Generate matching questions
function generateMatchingQuestions(
	vocabItems: VocabItem[],
	lessonId: number,
	startOrder: number,
	count: number
): schema.Question[] {
	const questions: schema.Question[] = [];

	// Each matching question uses 4 pairs
	const pairsPerQuestion = 4;
	const questionsToCreate = Math.min(count, Math.floor(vocabItems.length / pairsPerQuestion));

	for (let i = 0; i < questionsToCreate; i++) {
		const startIdx = (i * pairsPerQuestion) % vocabItems.length;
		const selectedVocab: VocabItem[] = [];

		for (let j = 0; j < pairsPerQuestion; j++) {
			selectedVocab.push(vocabItems[(startIdx + j) % vocabItems.length]);
		}

		const pairs = selectedVocab.map((v) => ({
			spanish: v.es,
			english: v.en
		}));

		questions.push({
			id: 0,
			lessonId,
			type: 'matching' as const,
			content: { pairs },
			correctAnswer: 'all_matched',
			audioUrl: null,
			order: startOrder + i,
			createdAt: new Date()
		});
	}

	return questions;
}

// Generate all 50 questions for a lesson
function generateLessonQuestions(
	unitVocab: UnitVocab,
	lessonId: number,
	lessonNumber: number
): Omit<schema.Question, 'id' | 'createdAt'>[] {
	const vocab = unitVocab.vocab;
	const sentences = unitVocab.sentences;

	// Rotate through vocab based on lesson number for variety
	const offset = (lessonNumber - 1) * 3;
	const rotatedVocab = [...vocab.slice(offset % vocab.length), ...vocab.slice(0, offset % vocab.length)];

	const allQuestions: Omit<schema.Question, 'id' | 'createdAt'>[] = [];

	// 15 Multiple Choice questions
	const mcQuestions = generateMultipleChoiceQuestions(rotatedVocab, lessonId, 1, 15);
	allQuestions.push(
		...mcQuestions.map((q) => ({
			lessonId: q.lessonId,
			type: q.type,
			content: q.content,
			correctAnswer: q.correctAnswer,
			audioUrl: q.audioUrl,
			order: q.order
		}))
	);

	// 15 Fill in the Blank questions
	const fillQuestions = generateFillBlankQuestions(rotatedVocab, sentences, lessonId, 16, 15);
	allQuestions.push(
		...fillQuestions.map((q) => ({
			lessonId: q.lessonId,
			type: q.type,
			content: q.content,
			correctAnswer: q.correctAnswer,
			audioUrl: q.audioUrl,
			order: q.order
		}))
	);

	// 10 Translation questions
	const transQuestions = generateTranslationQuestions(rotatedVocab, sentences, lessonId, 31, 10);
	allQuestions.push(
		...transQuestions.map((q) => ({
			lessonId: q.lessonId,
			type: q.type,
			content: q.content,
			correctAnswer: q.correctAnswer,
			audioUrl: q.audioUrl,
			order: q.order
		}))
	);

	// 10 Matching questions
	const matchQuestions = generateMatchingQuestions(rotatedVocab, lessonId, 41, 10);
	allQuestions.push(
		...matchQuestions.map((q) => ({
			lessonId: q.lessonId,
			type: q.type,
			content: q.content,
			correctAnswer: q.correctAnswer,
			audioUrl: q.audioUrl,
			order: q.order
		}))
	);

	return allQuestions;
}

// Generate exam questions (10 questions from unit's vocab pool)
function generateExamQuestions(
	unitVocab: UnitVocab,
	lessonId: number
): Omit<schema.Question, 'id' | 'createdAt'>[] {
	const vocab = unitVocab.vocab;
	const sentences = unitVocab.sentences;
	const allQuestions: Omit<schema.Question, 'id' | 'createdAt'>[] = [];

	// 3 Multiple Choice
	const mcQuestions = generateMultipleChoiceQuestions(shuffle(vocab), lessonId, 1, 3);
	allQuestions.push(
		...mcQuestions.map((q) => ({
			lessonId: q.lessonId,
			type: q.type,
			content: q.content,
			correctAnswer: q.correctAnswer,
			audioUrl: q.audioUrl,
			order: q.order
		}))
	);

	// 3 Fill in the Blank
	const fillQuestions = generateFillBlankQuestions(shuffle(vocab), sentences, lessonId, 4, 3);
	allQuestions.push(
		...fillQuestions.map((q) => ({
			lessonId: q.lessonId,
			type: q.type,
			content: q.content,
			correctAnswer: q.correctAnswer,
			audioUrl: q.audioUrl,
			order: q.order
		}))
	);

	// 2 Translation
	const transQuestions = generateTranslationQuestions(shuffle(vocab), sentences, lessonId, 7, 2);
	allQuestions.push(
		...transQuestions.map((q) => ({
			lessonId: q.lessonId,
			type: q.type,
			content: q.content,
			correctAnswer: q.correctAnswer,
			audioUrl: q.audioUrl,
			order: q.order
		}))
	);

	// 2 Matching
	const matchQuestions = generateMatchingQuestions(shuffle(vocab), lessonId, 9, 2);
	allQuestions.push(
		...matchQuestions.map((q) => ({
			lessonId: q.lessonId,
			type: q.type,
			content: q.content,
			correctAnswer: q.correctAnswer,
			audioUrl: q.audioUrl,
			order: q.order
		}))
	);

	return allQuestions;
}

// Lesson title templates
const LESSON_TITLES = [
	'Introduction to {topic}',
	'Basic {topic}',
	'{topic} Practice',
	'Learning {topic}',
	'{topic} Vocabulary',
	'{topic} Essentials',
	'{topic} Fundamentals',
	'Mastering {topic}',
	'{topic} Review',
	'{topic} Challenge',
	'Advanced {topic}',
	'{topic} in Context',
	'{topic} Phrases',
	'{topic} Expressions',
	'{topic} Drill',
	'{topic} Builder',
	'{topic} Workshop',
	'{topic} Deep Dive',
	'{topic} Skills',
	'{topic} Mastery'
];

// Lesson type rotation
const LESSON_TYPES: ('vocabulary' | 'fill_in_blank' | 'multiple_choice')[] = [
	'vocabulary',
	'multiple_choice',
	'fill_in_blank'
];

async function seed() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error('DATABASE_URL is not set');
	}

	const client = postgres(databaseUrl);
	const db = drizzle(client, { schema });

	console.log('🌱 Starting comprehensive database seed...\n');

	// Clear existing data (optional - comment out if you want to keep existing data)
	console.log('🗑️  Clearing existing data...');
	await db.delete(questions);
	await db.delete(lessons);
	await db.delete(units);
	await db.delete(levels);
	await db.delete(achievements);

	// Seed CEFR Levels
	console.log('📚 Creating CEFR levels...');
	const levelData = [
		{
			code: 'A1' as const,
			name: 'Beginner',
			description: 'Basic phrases and expressions for everyday situations',
			order: 1
		},
		{
			code: 'A2' as const,
			name: 'Elementary',
			description: 'Simple sentences about familiar topics',
			order: 2
		},
		{
			code: 'B1' as const,
			name: 'Intermediate',
			description: 'Main points on familiar matters regularly encountered',
			order: 3
		},
		{
			code: 'B2' as const,
			name: 'Upper Intermediate',
			description: 'Complex texts on both concrete and abstract topics',
			order: 4
		},
		{
			code: 'C1' as const,
			name: 'Advanced',
			description: 'Demanding texts and implicit meaning recognition',
			order: 5
		},
		{
			code: 'C2' as const,
			name: 'Mastery',
			description: 'Near-native fluency and understanding',
			order: 6
		}
	];

	const insertedLevels = await db.insert(levels).values(levelData).returning();
	console.log(`   ✓ Created ${insertedLevels.length} levels\n`);

	// Map levels by code for easy lookup
	const levelMap = new Map(insertedLevels.map((l) => [l.code, l]));

	// All vocabulary data by level
	const LEVEL_UNITS: Record<string, UnitVocab[]> = {
		A1: A1_UNITS,
		A2: A2_UNITS,
		B1: B1_UNITS,
		B2: B2_UNITS,
		C1: C1_UNITS,
		C2: C2_UNITS
	};

	let totalLessons = 0;
	let totalQuestions = 0;

	// Process each level
	for (const [levelCode, unitVocabs] of Object.entries(LEVEL_UNITS)) {
		const level = levelMap.get(levelCode as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2');
		if (!level) continue;

		console.log(`\n📖 Processing Level ${levelCode} (${level.name})...`);
		console.log(`   Units to create: ${unitVocabs.length}`);

		// Create units for this level
		for (let unitIndex = 0; unitIndex < unitVocabs.length; unitIndex++) {
			const unitVocab = unitVocabs[unitIndex];

			const [insertedUnit] = await db
				.insert(units)
				.values({
					levelId: level.id,
					title: unitVocab.title,
					description: unitVocab.description,
					order: unitIndex + 1,
					themeColor: unitVocab.themeColor
				})
				.returning();

			console.log(`   📁 Unit ${unitIndex + 1}: ${unitVocab.title}`);

			// Create 20 lessons per unit
			const lessonsPerUnit = 20;
			const lessonInserts: Omit<schema.Lesson, 'id' | 'createdAt' | 'updatedAt'>[] = [];

			for (let lessonNum = 1; lessonNum <= lessonsPerUnit; lessonNum++) {
				const titleTemplate = LESSON_TITLES[(lessonNum - 1) % LESSON_TITLES.length];
				const title = titleTemplate.replace('{topic}', unitVocab.title);

				lessonInserts.push({
					unitId: insertedUnit.id,
					title: `${lessonNum}. ${title}`,
					description: `Lesson ${lessonNum} of ${unitVocab.title}`,
					type: LESSON_TYPES[(lessonNum - 1) % LESSON_TYPES.length],
					xpReward: 10 + Math.floor(lessonNum / 5) * 5, // XP increases every 5 lessons
					order: lessonNum,
					isPublished: true,
					isExam: false,
					examPassThreshold: null,
					requiredLessonId: null
				});
			}

			// Add exam at the end
			lessonInserts.push({
				unitId: insertedUnit.id,
				title: `${unitVocab.title} - Unit Exam`,
				description: `Final exam for ${unitVocab.title}. Score 80% to pass.`,
				type: 'multiple_choice' as const,
				xpReward: 50, // Higher XP for exam
				order: lessonsPerUnit + 1,
				isPublished: true,
				isExam: true,
				examPassThreshold: 80,
				requiredLessonId: null
			});

			// Insert all lessons for this unit
			const insertedLessons = await db.insert(lessons).values(lessonInserts).returning();
			totalLessons += insertedLessons.length;

			// Generate questions for each lesson
			for (let i = 0; i < insertedLessons.length; i++) {
				const lesson = insertedLessons[i];
				let questionInserts: Omit<schema.Question, 'id' | 'createdAt'>[];

				if (lesson.isExam) {
					// Exam has 10 questions
					questionInserts = generateExamQuestions(unitVocab, lesson.id);
				} else {
					// Regular lesson has 50 questions
					questionInserts = generateLessonQuestions(unitVocab, lesson.id, i + 1);
				}

				if (questionInserts.length > 0) {
					await db.insert(questions).values(questionInserts);
					totalQuestions += questionInserts.length;
				}
			}

			console.log(`      ✓ Created ${insertedLessons.length} lessons with questions`);
		}
	}

	// Seed Achievements
	console.log('\n🏆 Creating achievements...');
	const achievementData = [
		{
			name: 'First Steps',
			description: 'Complete your first lesson',
			iconUrl: '/achievements/first-steps.svg',
			criteria: { type: 'lessons_completed', count: 1 }
		},
		{
			name: 'Getting Started',
			description: 'Complete 5 lessons',
			iconUrl: '/achievements/getting-started.svg',
			criteria: { type: 'lessons_completed', count: 5 }
		},
		{
			name: 'Committed Learner',
			description: 'Complete 25 lessons',
			iconUrl: '/achievements/committed-learner.svg',
			criteria: { type: 'lessons_completed', count: 25 }
		},
		{
			name: 'Lesson Master',
			description: 'Complete 100 lessons',
			iconUrl: '/achievements/lesson-master.svg',
			criteria: { type: 'lessons_completed', count: 100 }
		},
		{
			name: 'Spanish Scholar',
			description: 'Complete 500 lessons',
			iconUrl: '/achievements/spanish-scholar.svg',
			criteria: { type: 'lessons_completed', count: 500 }
		},
		{
			name: 'Week Warrior',
			description: 'Maintain a 7-day streak',
			iconUrl: '/achievements/week-warrior.svg',
			criteria: { type: 'streak', count: 7 }
		},
		{
			name: 'Month Master',
			description: 'Maintain a 30-day streak',
			iconUrl: '/achievements/month-master.svg',
			criteria: { type: 'streak', count: 30 }
		},
		{
			name: 'Streak Legend',
			description: 'Maintain a 100-day streak',
			iconUrl: '/achievements/streak-legend.svg',
			criteria: { type: 'streak', count: 100 }
		},
		{
			name: 'Century Club',
			description: 'Earn 100 XP',
			iconUrl: '/achievements/century-club.svg',
			criteria: { type: 'xp', count: 100 }
		},
		{
			name: 'XP Thousandaire',
			description: 'Earn 1,000 XP',
			iconUrl: '/achievements/xp-thousandaire.svg',
			criteria: { type: 'xp', count: 1000 }
		},
		{
			name: 'XP Champion',
			description: 'Earn 10,000 XP',
			iconUrl: '/achievements/xp-champion.svg',
			criteria: { type: 'xp', count: 10000 }
		},
		{
			name: 'Perfect Score',
			description: 'Complete a lesson with no mistakes',
			iconUrl: '/achievements/perfect-score.svg',
			criteria: { type: 'perfect_lesson', count: 1 }
		},
		{
			name: 'Perfectionist',
			description: 'Complete 10 lessons with no mistakes',
			iconUrl: '/achievements/perfectionist.svg',
			criteria: { type: 'perfect_lesson', count: 10 }
		},
		{
			name: 'Exam Ace',
			description: 'Pass your first unit exam',
			iconUrl: '/achievements/exam-ace.svg',
			criteria: { type: 'exams_passed', count: 1 }
		},
		{
			name: 'Exam Expert',
			description: 'Pass 10 unit exams',
			iconUrl: '/achievements/exam-expert.svg',
			criteria: { type: 'exams_passed', count: 10 }
		},
		{
			name: 'A1 Complete',
			description: 'Complete all A1 lessons',
			iconUrl: '/achievements/a1-complete.svg',
			criteria: { type: 'level_complete', level: 'A1' }
		},
		{
			name: 'A2 Complete',
			description: 'Complete all A2 lessons',
			iconUrl: '/achievements/a2-complete.svg',
			criteria: { type: 'level_complete', level: 'A2' }
		},
		{
			name: 'B1 Complete',
			description: 'Complete all B1 lessons',
			iconUrl: '/achievements/b1-complete.svg',
			criteria: { type: 'level_complete', level: 'B1' }
		},
		{
			name: 'B2 Complete',
			description: 'Complete all B2 lessons',
			iconUrl: '/achievements/b2-complete.svg',
			criteria: { type: 'level_complete', level: 'B2' }
		},
		{
			name: 'C1 Complete',
			description: 'Complete all C1 lessons',
			iconUrl: '/achievements/c1-complete.svg',
			criteria: { type: 'level_complete', level: 'C1' }
		},
		{
			name: 'C2 Complete',
			description: 'Complete all C2 lessons - You are a Spanish Master!',
			iconUrl: '/achievements/c2-complete.svg',
			criteria: { type: 'level_complete', level: 'C2' }
		},
		{
			name: 'Freeze Master',
			description: 'Earn 5 streak freezes',
			iconUrl: '/achievements/freeze-master.svg',
			criteria: { type: 'freezes_earned', count: 5 }
		},
		{
			name: 'Question Crusher',
			description: 'Answer 1,000 questions correctly',
			iconUrl: '/achievements/question-crusher.svg',
			criteria: { type: 'correct_answers', count: 1000 }
		}
	];

	await db.insert(achievements).values(achievementData);
	console.log(`   ✓ Created ${achievementData.length} achievements\n`);

	// Summary
	console.log('═══════════════════════════════════════════════');
	console.log('🎉 Database seeding complete!\n');
	console.log(`📊 Summary:`);
	console.log(`   • Levels: ${insertedLevels.length}`);
	console.log(`   • Units: ${Object.values(LEVEL_UNITS).flat().length}`);
	console.log(`   • Lessons: ${totalLessons}`);
	console.log(`   • Questions: ${totalQuestions}`);
	console.log(`   • Achievements: ${achievementData.length}`);
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

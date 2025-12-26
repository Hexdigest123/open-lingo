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

// Validation warnings tracker
const validationWarnings: string[] = [];

function warnValidation(message: string) {
	validationWarnings.push(message);
}

// Validate bilingual content for a question
function validateBilingualContent(
	questionType: string,
	content: Record<string, unknown>,
	lessonId: number
): void {
	switch (questionType) {
		case 'multiple_choice':
			if (!content.questionEn) warnValidation(`MC question in lesson ${lessonId}: missing questionEn`);
			if (!content.questionDe) warnValidation(`MC question in lesson ${lessonId}: missing questionDe`);
			break;
		case 'translation':
			if (content.direction === 'native_to_es') {
				if (!content.textEn && !content.textDe) {
					warnValidation(`Translation in lesson ${lessonId}: native_to_es missing both textEn and textDe`);
				}
			}
			break;
		case 'matching':
			const pairs = content.pairs as Array<{ german?: string }> | undefined;
			if (pairs) {
				const missingGerman = pairs.filter((p) => !p.german).length;
				if (missingGerman > 0) {
					warnValidation(`Matching in lesson ${lessonId}: ${missingGerman}/${pairs.length} pairs missing German`);
				}
			}
			break;
		case 'listening':
			const textToHear = content.textToHear as string;
			if (textToHear && textToHear.split(/\s+/).length < 3) {
				warnValidation(`Listening in lesson ${lessonId}: textToHear too short (${textToHear})`);
			}
			break;
		case 'word_order':
			if (content.instructionEn && !content.instructionDe) {
				warnValidation(`WordOrder in lesson ${lessonId}: missing instructionDe`);
			}
			break;
	}
}

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

// Generate multiple choice questions (bilingual - store both English and German)
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

		// Store both English and German versions - UI will select based on locale
		questions.push({
			id: 0, // Will be set by DB
			lessonId,
			type: 'multiple_choice' as const,
			content: {
				questionEn: `How do you say "${item.en}" in Spanish?`,
				questionDe: `Wie sagt man "${item.de}" auf Spanisch?`,
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

// Generate fill in the blank questions (bilingual - store both English and German)
function generateFillBlankQuestions(
	vocabItems: VocabItem[],
	sentences: { es: string; en: string; de: string }[],
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
				// Store both English and German hints
				questions.push({
					id: 0,
					lessonId,
					type: 'fill_blank' as const,
					content: {
						sentence: blankSentence,
						hintEn: vocab.en,
						hintDe: vocab.de
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

	// If we need more, create simple fill-in-blank from vocab (store both language versions)
	for (let i = 0; added < count && i < shuffledVocab.length; i++) {
		const item = shuffledVocab[i];

		questions.push({
			id: 0,
			lessonId,
			type: 'fill_blank' as const,
			content: {
				sentenceEn: `The Spanish word for "${item.en}" is _____.`,
				sentenceDe: `Das spanische Wort für "${item.de}" ist _____.`,
				hintEn: `Starts with "${item.es.charAt(0)}"`,
				hintDe: `Beginnt mit "${item.es.charAt(0)}"`
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

// Generate translation questions (unified directions - adapts to user's locale)
function generateTranslationQuestions(
	vocabItems: VocabItem[],
	sentences: { es: string; en: string; de: string }[],
	lessonId: number,
	startOrder: number,
	count: number
): schema.Question[] {
	const questions: schema.Question[] = [];
	const halfCount = Math.ceil(count / 2);

	// Native to Spanish translations (store both English and German source text)
	const nativeToEsItems = getRandomItems(vocabItems, halfCount);
	for (let i = 0; i < nativeToEsItems.length; i++) {
		const item = nativeToEsItems[i];
		questions.push({
			id: 0,
			lessonId,
			type: 'translation' as const,
			content: {
				textEn: item.en,
				textDe: item.de,
				direction: 'native_to_es'
			},
			correctAnswer: item.es,
			audioUrl: null,
			order: startOrder + i,
			createdAt: new Date()
		});
	}

	// Spanish to Native translations (store pipe-separated correct answers)
	const remainingVocab = vocabItems.filter((v) => !nativeToEsItems.includes(v));
	const esToNativeItems = getRandomItems(remainingVocab, count - halfCount);
	for (let i = 0; i < esToNativeItems.length; i++) {
		const item = esToNativeItems[i];
		questions.push({
			id: 0,
			lessonId,
			type: 'translation' as const,
			content: {
				text: item.es,
				direction: 'es_to_native'
			},
			// Store both valid answers separated by pipe
			correctAnswer: `${item.en}|${item.de}`,
			audioUrl: null,
			order: startOrder + halfCount + i,
			createdAt: new Date()
		});
	}

	return questions;
}

// Generate matching questions (bilingual - store both English and German)
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

		// Store both English and German versions - UI will select based on locale
		const pairs = selectedVocab.map((v) => ({
			spanish: v.es,
			english: v.en,
			german: v.de
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

// Generate word order questions (bilingual - arrange words to form sentences)
function generateWordOrderQuestions(
	vocabItems: VocabItem[],
	sentences: { es: string; en: string; de: string }[],
	lessonId: number,
	startOrder: number,
	count: number
): schema.Question[] {
	const questions: schema.Question[] = [];
	const shuffledSentences = shuffle(sentences);

	for (let i = 0; i < count && i < shuffledSentences.length; i++) {
		const sentence = shuffledSentences[i];

		// Split sentence into words and shuffle them
		const words = sentence.es.split(/\s+/).filter(Boolean);
		if (words.length < 3) continue; // Skip very short sentences

		const scrambledWords = shuffle(words);

		questions.push({
			id: 0,
			lessonId,
			type: 'word_order' as const,
			content: {
				words: scrambledWords,
				instructionEn: `Arrange the words to form: "${sentence.en}"`,
				instructionDe: `Ordne die Wörter, um zu bilden: "${sentence.de}"`
			},
			correctAnswer: sentence.es,
			audioUrl: null,
			order: startOrder + i,
			createdAt: new Date()
		});
	}

	return questions;
}

// Generate speaking questions (pronunciation practice)
function generateSpeakingQuestions(
	vocabItems: VocabItem[],
	lessonId: number,
	startOrder: number,
	count: number
): schema.Question[] {
	const questions: schema.Question[] = [];
	const shuffledVocab = shuffle(vocabItems);

	for (let i = 0; i < count && i < shuffledVocab.length; i++) {
		const item = shuffledVocab[i];

		questions.push({
			id: 0,
			lessonId,
			type: 'speaking' as const,
			content: {
				textToSpeak: item.es,
				hintEn: item.en,
				hintDe: item.de
			},
			correctAnswer: item.es,
			audioUrl: null,
			order: startOrder + i,
			createdAt: new Date()
		});
	}

	return questions;
}

// Generate listening questions (hear and identify)
// Uses sentences for better audio comprehension (single words are too short to understand)
// Supports bilingual answers - both English and German correct answers
function generateListeningQuestions(
	vocabItems: VocabItem[],
	sentences: { es: string; en: string; de: string }[],
	lessonId: number,
	startOrder: number,
	count: number
): schema.Question[] {
	const questions: schema.Question[] = [];

	// Filter sentences to only use those with 3+ words (short phrases are hard to hear)
	const validSentences = sentences.filter((s) => s.es.split(/\s+/).length >= 3);

	// Use sentences primarily - they're longer and easier to understand as audio
	const shuffledSentences = shuffle(validSentences);
	const shuffledVocab = shuffle(vocabItems);

	let added = 0;

	// First, use sentences (preferred - longer audio is easier to understand)
	for (let i = 0; i < shuffledSentences.length && added < count; i++) {
		const sentence = shuffledSentences[i];

		// Alternate between type and multiple choice
		const answerType = added % 2 === 0 ? 'type' : 'multiple_choice';

		let optionsEn: string[] | undefined;
		let optionsDe: string[] | undefined;
		if (answerType === 'multiple_choice') {
			const otherSentences = validSentences.filter((s) => s.es !== sentence.es);
			const wrongSentences = getRandomItems(otherSentences, 3);
			const wrongAnswersEn = wrongSentences.map((s) => s.en);
			const wrongAnswersDe = wrongSentences.map((s) => s.de);
			optionsEn = shuffle([sentence.en, ...wrongAnswersEn]);
			optionsDe = shuffle([sentence.de, ...wrongAnswersDe]);
		}

		questions.push({
			id: 0,
			lessonId,
			type: 'listening' as const,
			content: {
				textToHear: sentence.es,
				answerType,
				optionsEn,
				optionsDe,
				correctAnswerEn: sentence.en,
				correctAnswerDe: sentence.de
			},
			correctAnswer: `${sentence.en}|${sentence.de}`,
			audioUrl: null,
			order: startOrder + added,
			createdAt: new Date()
		});
		added++;
	}

	// Fall back to longer vocab phrases if we need more questions
	// Only use vocab items that are at least 3 words (multi-word phrases)
	const longVocab = shuffledVocab.filter((v) => v.es.split(/\s+/).length >= 3);
	for (let i = 0; i < longVocab.length && added < count; i++) {
		const item = longVocab[i];

		const answerType = added % 2 === 0 ? 'type' : 'multiple_choice';

		let optionsEn: string[] | undefined;
		let optionsDe: string[] | undefined;
		if (answerType === 'multiple_choice') {
			const otherItems = longVocab.filter((v) => v.es !== item.es);
			const wrongItems = getRandomItems(otherItems, 3);
			const wrongAnswersEn = wrongItems.map((v) => v.en);
			const wrongAnswersDe = wrongItems.map((v) => v.de);
			optionsEn = shuffle([item.en, ...wrongAnswersEn]);
			optionsDe = shuffle([item.de, ...wrongAnswersDe]);
		}

		questions.push({
			id: 0,
			lessonId,
			type: 'listening' as const,
			content: {
				textToHear: item.es,
				answerType,
				optionsEn,
				optionsDe,
				correctAnswerEn: item.en,
				correctAnswerDe: item.de
			},
			correctAnswer: `${item.en}|${item.de}`,
			audioUrl: null,
			order: startOrder + added,
			createdAt: new Date()
		});
		added++;
	}

	return questions;
}

// Generate all 50 questions for a lesson (always includes voice tasks)
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
	let currentOrder = 1;

	// Helper to add questions
	const addQuestions = (qs: schema.Question[]) => {
		allQuestions.push(
			...qs.map((q) => ({
				lessonId: q.lessonId,
				type: q.type,
				content: q.content,
				correctAnswer: q.correctAnswer,
				audioUrl: q.audioUrl,
				order: q.order
			}))
		);
		currentOrder += qs.length;
	};

	// Distribution (50 total):
	// 10 MC, 10 Fill, 8 Trans, 6 Match, 6 WordOrder, 5 Speaking, 5 Listening
	// Voice tasks are always included - users without API key can skip them
	addQuestions(generateMultipleChoiceQuestions(rotatedVocab, lessonId, currentOrder, 10));
	addQuestions(generateFillBlankQuestions(rotatedVocab, sentences, lessonId, currentOrder, 10));
	addQuestions(generateTranslationQuestions(rotatedVocab, sentences, lessonId, currentOrder, 8));
	addQuestions(generateMatchingQuestions(rotatedVocab, lessonId, currentOrder, 6));
	addQuestions(generateWordOrderQuestions(rotatedVocab, sentences, lessonId, currentOrder, 6));
	addQuestions(generateSpeakingQuestions(rotatedVocab, lessonId, currentOrder, 5));
	addQuestions(generateListeningQuestions(rotatedVocab, sentences, lessonId, currentOrder, 5));

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

	// Helper to add questions
	const addQuestions = (qs: schema.Question[]) => {
		allQuestions.push(
			...qs.map((q) => ({
				lessonId: q.lessonId,
				type: q.type,
				content: q.content,
				correctAnswer: q.correctAnswer,
				audioUrl: q.audioUrl,
				order: q.order
			}))
		);
	};

	// Exam distribution (10 questions):
	// 2 MC, 2 Fill, 2 Trans, 2 Match, 2 WordOrder
	addQuestions(generateMultipleChoiceQuestions(shuffle(vocab), lessonId, 1, 2));
	addQuestions(generateFillBlankQuestions(shuffle(vocab), sentences, lessonId, 3, 2));
	addQuestions(generateTranslationQuestions(shuffle(vocab), sentences, lessonId, 5, 2));
	addQuestions(generateMatchingQuestions(shuffle(vocab), lessonId, 7, 2));
	addQuestions(generateWordOrderQuestions(shuffle(vocab), sentences, lessonId, 9, 2));

	return allQuestions;
}

// Lesson title templates (English and German pairs)
const LESSON_TITLES = [
	{ en: 'Introduction to {topic}', de: 'Einführung in {topic}' },
	{ en: 'Basic {topic}', de: 'Grundlagen {topic}' },
	{ en: '{topic} Practice', de: '{topic} Übung' },
	{ en: 'Learning {topic}', de: '{topic} Lernen' },
	{ en: '{topic} Vocabulary', de: '{topic} Vokabeln' },
	{ en: '{topic} Essentials', de: '{topic} Grundlagen' },
	{ en: '{topic} Fundamentals', de: '{topic} Grundprinzipien' },
	{ en: 'Mastering {topic}', de: '{topic} Meistern' },
	{ en: '{topic} Review', de: '{topic} Wiederholung' },
	{ en: '{topic} Challenge', de: '{topic} Herausforderung' },
	{ en: 'Advanced {topic}', de: 'Fortgeschrittene {topic}' },
	{ en: '{topic} in Context', de: '{topic} im Kontext' },
	{ en: '{topic} Phrases', de: '{topic} Ausdrücke' },
	{ en: '{topic} Expressions', de: '{topic} Redewendungen' },
	{ en: '{topic} Drill', de: '{topic} Training' },
	{ en: '{topic} Builder', de: '{topic} Aufbau' },
	{ en: '{topic} Workshop', de: '{topic} Workshop' },
	{ en: '{topic} Deep Dive', de: '{topic} Vertiefung' },
	{ en: '{topic} Skills', de: '{topic} Fähigkeiten' },
	{ en: '{topic} Mastery', de: '{topic} Beherrschung' }
];

// Helper to create bilingual JSON strings
function bilingual(en: string, de: string): string {
	return JSON.stringify({ en, de });
}

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

	// Seed CEFR Levels (bilingual names and descriptions)
	console.log('📚 Creating CEFR levels...');
	const levelData = [
		{
			code: 'A1' as const,
			name: bilingual('Beginner', 'Anfänger'),
			description: bilingual(
				'Basic phrases and expressions for everyday situations',
				'Grundlegende Ausdrücke und Phrasen für alltägliche Situationen'
			),
			order: 1
		},
		{
			code: 'A2' as const,
			name: bilingual('Elementary', 'Grundlegend'),
			description: bilingual(
				'Simple sentences about familiar topics',
				'Einfache Sätze zu vertrauten Themen'
			),
			order: 2
		},
		{
			code: 'B1' as const,
			name: bilingual('Intermediate', 'Mittelstufe'),
			description: bilingual(
				'Main points on familiar matters regularly encountered',
				'Hauptpunkte zu vertrauten Themen, denen man regelmäßig begegnet'
			),
			order: 3
		},
		{
			code: 'B2' as const,
			name: bilingual('Upper Intermediate', 'Obere Mittelstufe'),
			description: bilingual(
				'Complex texts on both concrete and abstract topics',
				'Komplexe Texte zu konkreten und abstrakten Themen'
			),
			order: 4
		},
		{
			code: 'C1' as const,
			name: bilingual('Advanced', 'Fortgeschritten'),
			description: bilingual(
				'Demanding texts and implicit meaning recognition',
				'Anspruchsvolle Texte und Erkennung impliziter Bedeutungen'
			),
			order: 5
		},
		{
			code: 'C2' as const,
			name: bilingual('Mastery', 'Beherrschung'),
			description: bilingual(
				'Near-native fluency and understanding',
				'Fast muttersprachliche Sprachgewandtheit und Verständnis'
			),
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
					title: bilingual(unitVocab.titleEn, unitVocab.titleDe),
					description: bilingual(unitVocab.descriptionEn, unitVocab.descriptionDe),
					order: unitIndex + 1,
					themeColor: unitVocab.themeColor
				})
				.returning();

			console.log(`   📁 Unit ${unitIndex + 1}: ${unitVocab.titleEn}`);

			// Create 20 lessons per unit
			const lessonsPerUnit = 20;
			const lessonInserts: Omit<schema.Lesson, 'id' | 'createdAt' | 'updatedAt'>[] = [];

			for (let lessonNum = 1; lessonNum <= lessonsPerUnit; lessonNum++) {
				const titleTemplate = LESSON_TITLES[(lessonNum - 1) % LESSON_TITLES.length];
				const titleEn = titleTemplate.en.replace('{topic}', unitVocab.titleEn);
				const titleDe = titleTemplate.de.replace('{topic}', unitVocab.titleDe);

				lessonInserts.push({
					unitId: insertedUnit.id,
					title: bilingual(`${lessonNum}. ${titleEn}`, `${lessonNum}. ${titleDe}`),
					description: bilingual(
						`Lesson ${lessonNum} of ${unitVocab.titleEn}`,
						`Lektion ${lessonNum} von ${unitVocab.titleDe}`
					),
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
				title: bilingual(
					`${unitVocab.titleEn} - Unit Exam`,
					`${unitVocab.titleDe} - Prüfung`
				),
				description: bilingual(
					`Final exam for ${unitVocab.titleEn}. Score 80% to pass.`,
					`Abschlussprüfung für ${unitVocab.titleDe}. 80% zum Bestehen.`
				),
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

				// Validate each question for bilingual content
				for (const q of questionInserts) {
					validateBilingualContent(q.type, q.content as Record<string, unknown>, lesson.id);
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
			code: 'first_lesson',
			name: 'First Steps',
			description: 'Complete your first lesson',
			iconUrl: '/achievements/first-steps.svg',
			criteria: { type: 'lessons_completed', count: 1 }
		},
		{
			code: 'lessons_5',
			name: 'Getting Started',
			description: 'Complete 5 lessons',
			iconUrl: '/achievements/getting-started.svg',
			criteria: { type: 'lessons_completed', count: 5 }
		},
		{
			code: 'lessons_25',
			name: 'Committed Learner',
			description: 'Complete 25 lessons',
			iconUrl: '/achievements/committed-learner.svg',
			criteria: { type: 'lessons_completed', count: 25 }
		},
		{
			code: 'lessons_100',
			name: 'Lesson Master',
			description: 'Complete 100 lessons',
			iconUrl: '/achievements/lesson-master.svg',
			criteria: { type: 'lessons_completed', count: 100 }
		},
		{
			code: 'lessons_500',
			name: 'Spanish Scholar',
			description: 'Complete 500 lessons',
			iconUrl: '/achievements/spanish-scholar.svg',
			criteria: { type: 'lessons_completed', count: 500 }
		},
		{
			code: 'streak_7',
			name: 'Week Warrior',
			description: 'Maintain a 7-day streak',
			iconUrl: '/achievements/week-warrior.svg',
			criteria: { type: 'streak', count: 7 }
		},
		{
			code: 'streak_30',
			name: 'Month Master',
			description: 'Maintain a 30-day streak',
			iconUrl: '/achievements/month-master.svg',
			criteria: { type: 'streak', count: 30 }
		},
		{
			code: 'streak_100',
			name: 'Streak Legend',
			description: 'Maintain a 100-day streak',
			iconUrl: '/achievements/streak-legend.svg',
			criteria: { type: 'streak', count: 100 }
		},
		{
			code: 'xp_100',
			name: 'Century Club',
			description: 'Earn 100 XP',
			iconUrl: '/achievements/century-club.svg',
			criteria: { type: 'xp', count: 100 }
		},
		{
			code: 'xp_1000',
			name: 'XP Thousandaire',
			description: 'Earn 1,000 XP',
			iconUrl: '/achievements/xp-thousandaire.svg',
			criteria: { type: 'xp', count: 1000 }
		},
		{
			code: 'xp_5000',
			name: 'XP Champion',
			description: 'Earn 10,000 XP',
			iconUrl: '/achievements/xp-champion.svg',
			criteria: { type: 'xp', count: 10000 }
		},
		{
			code: 'perfect_lesson',
			name: 'Perfect Score',
			description: 'Complete a lesson with no mistakes',
			iconUrl: '/achievements/perfect-score.svg',
			criteria: { type: 'perfect_lesson', count: 1 }
		},
		{
			code: 'perfect_10',
			name: 'Perfectionist',
			description: 'Complete 10 lessons with no mistakes',
			iconUrl: '/achievements/perfectionist.svg',
			criteria: { type: 'perfect_lesson', count: 10 }
		},
		{
			code: 'exam_1',
			name: 'Exam Ace',
			description: 'Pass your first unit exam',
			iconUrl: '/achievements/exam-ace.svg',
			criteria: { type: 'exams_passed', count: 1 }
		},
		{
			code: 'exam_10',
			name: 'Exam Expert',
			description: 'Pass 10 unit exams',
			iconUrl: '/achievements/exam-expert.svg',
			criteria: { type: 'exams_passed', count: 10 }
		},
		{
			code: 'level_a1',
			name: 'A1 Complete',
			description: 'Complete all A1 lessons',
			iconUrl: '/achievements/a1-complete.svg',
			criteria: { type: 'level_complete', level: 'A1' }
		},
		{
			code: 'level_a2',
			name: 'A2 Complete',
			description: 'Complete all A2 lessons',
			iconUrl: '/achievements/a2-complete.svg',
			criteria: { type: 'level_complete', level: 'A2' }
		},
		{
			code: 'level_b1',
			name: 'B1 Complete',
			description: 'Complete all B1 lessons',
			iconUrl: '/achievements/b1-complete.svg',
			criteria: { type: 'level_complete', level: 'B1' }
		},
		{
			code: 'level_b2',
			name: 'B2 Complete',
			description: 'Complete all B2 lessons',
			iconUrl: '/achievements/b2-complete.svg',
			criteria: { type: 'level_complete', level: 'B2' }
		},
		{
			code: 'level_c1',
			name: 'C1 Complete',
			description: 'Complete all C1 lessons',
			iconUrl: '/achievements/c1-complete.svg',
			criteria: { type: 'level_complete', level: 'C1' }
		},
		{
			code: 'level_c2',
			name: 'C2 Complete',
			description: 'Complete all C2 lessons - You are a Spanish Master!',
			iconUrl: '/achievements/c2-complete.svg',
			criteria: { type: 'level_complete', level: 'C2' }
		},
		{
			code: 'freeze_master',
			name: 'Freeze Master',
			description: 'Earn 5 streak freezes',
			iconUrl: '/achievements/freeze-master.svg',
			criteria: { type: 'freezes_earned', count: 5 }
		},
		{
			code: 'correct_1000',
			name: 'Question Crusher',
			description: 'Answer 1,000 questions correctly',
			iconUrl: '/achievements/question-crusher.svg',
			criteria: { type: 'correct_answers', count: 1000 }
		}
	];

	await db.insert(achievements).values(achievementData);
	console.log(`   ✓ Created ${achievementData.length} achievements\n`);

	// Print validation warnings if any
	if (validationWarnings.length > 0) {
		console.log('⚠️  Validation Warnings:');
		console.log('───────────────────────────────────────────────');
		// Group and show first 20 warnings
		const displayWarnings = validationWarnings.slice(0, 20);
		for (const warning of displayWarnings) {
			console.log(`   • ${warning}`);
		}
		if (validationWarnings.length > 20) {
			console.log(`   ... and ${validationWarnings.length - 20} more warnings`);
		}
		console.log('');
	}

	// Summary
	console.log('═══════════════════════════════════════════════');
	console.log('🎉 Database seeding complete!\n');
	console.log(`📊 Summary:`);
	console.log(`   • Levels: ${insertedLevels.length}`);
	console.log(`   • Units: ${Object.values(LEVEL_UNITS).flat().length}`);
	console.log(`   • Lessons: ${totalLessons}`);
	console.log(`   • Questions: ${totalQuestions}`);
	console.log(`   • Achievements: ${achievementData.length}`);
	if (validationWarnings.length > 0) {
		console.log(`   ⚠️  Validation warnings: ${validationWarnings.length}`);
	}
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

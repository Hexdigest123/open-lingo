import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import {
	A1_UNITS,
	A2_UNITS,
	B1_UNITS,
	B2_UNITS,
	C1_UNITS,
	C2_UNITS,
	type UnitVocab,
	type VocabItem
} from '../src/lib/data/spanish-vocabulary';
import 'dotenv/config';

const { questions, lessons, units, levels } = schema;

interface FixResult {
	questionId: number;
	type: string;
	issue: string;
	action: 'fixed' | 'skipped' | 'manual';
	details: string;
}

interface FixStats {
	total: number;
	fixed: number;
	skipped: number;
	manual: number;
}

// Map of level code to vocabulary data
const LEVEL_VOCAB: Record<string, UnitVocab[]> = {
	A1: A1_UNITS,
	A2: A2_UNITS,
	B1: B1_UNITS,
	B2: B2_UNITS,
	C1: C1_UNITS,
	C2: C2_UNITS
};

// Helper to get all vocabulary as a lookup map
function buildVocabLookup(): Map<string, VocabItem> {
	const lookup = new Map<string, VocabItem>();
	for (const unitVocabs of Object.values(LEVEL_VOCAB)) {
		for (const unit of unitVocabs) {
			for (const vocab of unit.vocab) {
				lookup.set(vocab.es.toLowerCase(), vocab);
				lookup.set(vocab.en.toLowerCase(), vocab);
			}
		}
	}
	return lookup;
}

// Helper to get all sentences
function getAllSentences(): Array<{ es: string; en: string; de: string }> {
	const sentences: Array<{ es: string; en: string; de: string }> = [];
	for (const unitVocabs of Object.values(LEVEL_VOCAB)) {
		for (const unit of unitVocabs) {
			sentences.push(...unit.sentences);
		}
	}
	return sentences;
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

async function fixQuestions() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error('DATABASE_URL is not set');
	}

	const client = postgres(databaseUrl);
	const db = drizzle(client, { schema });

	console.log('🔧 Starting question fixes...\n');

	const results: FixResult[] = [];
	const stats: FixStats = {
		total: 0,
		fixed: 0,
		skipped: 0,
		manual: 0
	};

	const vocabLookup = buildVocabLookup();
	const allSentences = getAllSentences();
	const shuffledSentences = shuffle(allSentences);
	let sentenceIndex = 0;

	// Fetch all questions with their lesson and unit info
	const allQuestions = await db
		.select({
			question: questions,
			lessonId: lessons.id,
			unitId: units.id,
			levelCode: levels.code
		})
		.from(questions)
		.innerJoin(lessons, eq(questions.lessonId, lessons.id))
		.innerJoin(units, eq(lessons.unitId, units.id))
		.innerJoin(levels, eq(units.levelId, levels.id));

	console.log(`📊 Total questions to check: ${allQuestions.length}\n`);

	for (const { question, levelCode, unitId } of allQuestions) {
		const content = question.content as Record<string, unknown>;

		// Get unit vocabulary for this question
		const unitVocabs = LEVEL_VOCAB[levelCode] || [];
		const unitIndex = (unitId - 1) % unitVocabs.length;
		const unitVocab = unitVocabs[unitIndex];

		switch (question.type) {
			case 'listening':
				await fixListeningQuestion(db, question, content, shuffledSentences, sentenceIndex, results, stats);
				sentenceIndex = (sentenceIndex + 1) % shuffledSentences.length;
				break;
			case 'matching':
				await fixMatchingQuestion(db, question, content, vocabLookup, results, stats);
				break;
			case 'word_order':
				await fixWordOrderQuestion(db, question, content, results, stats);
				break;
			case 'translation':
				await fixTranslationQuestion(db, question, content, vocabLookup, results, stats);
				break;
			case 'fill_blank':
				await fixFillBlankQuestion(db, question, content, vocabLookup, results, stats);
				break;
			case 'multiple_choice':
				await fixMultipleChoiceQuestion(db, question, content, results, stats);
				break;
		}
	}

	// Print summary
	printSummary(stats, results);

	await client.end();

	return { results, stats };
}

async function fixListeningQuestion(
	db: ReturnType<typeof drizzle>,
	question: typeof schema.questions.$inferSelect,
	content: Record<string, unknown>,
	sentences: Array<{ es: string; en: string; de: string }>,
	sentenceIndex: number,
	results: FixResult[],
	stats: FixStats
) {
	const textToHear = content.textToHear as string;
	if (!textToHear) return;

	const wordCount = textToHear.trim().split(/\s+/).length;
	if (wordCount >= 3) return; // Already long enough

	stats.total++;

	// Pick a sentence to use instead
	const sentence = sentences[sentenceIndex];

	const newContent = {
		...content,
		textToHear: sentence.es,
		correctAnswerEn: sentence.en,
		correctAnswerDe: sentence.de
	};

	// Update options if multiple choice
	if (content.answerType === 'multiple_choice') {
		// Generate new options based on the sentence
		const otherSentences = sentences.filter((s) => s.es !== sentence.es);
		const wrongSentences = otherSentences.slice(0, 3);
		const optionsEn = shuffle([sentence.en, ...wrongSentences.map((s) => s.en)]);
		const optionsDe = shuffle([sentence.de, ...wrongSentences.map((s) => s.de)]);

		newContent.optionsEn = optionsEn;
		newContent.optionsDe = optionsDe;
	}

	try {
		await db
			.update(questions)
			.set({
				content: newContent,
				correctAnswer: `${sentence.en}|${sentence.de}`
			})
			.where(eq(questions.id, question.id));

		results.push({
			questionId: question.id,
			type: 'listening',
			issue: 'text_too_short',
			action: 'fixed',
			details: `Changed from "${textToHear}" to "${sentence.es}"`
		});
		stats.fixed++;
	} catch (error) {
		results.push({
			questionId: question.id,
			type: 'listening',
			issue: 'text_too_short',
			action: 'skipped',
			details: `Failed to update: ${error}`
		});
		stats.skipped++;
	}
}

async function fixMatchingQuestion(
	db: ReturnType<typeof drizzle>,
	question: typeof schema.questions.$inferSelect,
	content: Record<string, unknown>,
	vocabLookup: Map<string, VocabItem>,
	results: FixResult[],
	stats: FixStats
) {
	const pairs = content.pairs as Array<{
		spanish: string;
		english: string;
		german?: string;
	}>;

	if (!pairs || !Array.isArray(pairs)) return;

	let needsUpdate = false;
	const fixedPairs = pairs.map((pair) => {
		if (pair.german) return pair;

		// Try to find German translation from vocabulary
		const vocab = vocabLookup.get(pair.spanish?.toLowerCase()) || vocabLookup.get(pair.english?.toLowerCase());

		if (vocab) {
			needsUpdate = true;
			return {
				...pair,
				german: vocab.de
			};
		}

		return pair;
	});

	if (!needsUpdate) return;

	const missingGerman = fixedPairs.filter((p) => !p.german).length;
	if (missingGerman > 0) {
		stats.total++;
		results.push({
			questionId: question.id,
			type: 'matching',
			issue: 'missing_german',
			action: 'manual',
			details: `${missingGerman}/${pairs.length} pairs still missing German - vocabulary not found`
		});
		stats.manual++;
		return;
	}

	stats.total++;

	try {
		await db
			.update(questions)
			.set({ content: { ...content, pairs: fixedPairs } })
			.where(eq(questions.id, question.id));

		results.push({
			questionId: question.id,
			type: 'matching',
			issue: 'missing_german',
			action: 'fixed',
			details: `Added German translations for ${pairs.length} pairs`
		});
		stats.fixed++;
	} catch (error) {
		results.push({
			questionId: question.id,
			type: 'matching',
			issue: 'missing_german',
			action: 'skipped',
			details: `Failed to update: ${error}`
		});
		stats.skipped++;
	}
}

async function fixWordOrderQuestion(
	db: ReturnType<typeof drizzle>,
	question: typeof schema.questions.$inferSelect,
	content: Record<string, unknown>,
	results: FixResult[],
	stats: FixStats
) {
	const instructionEn = content.instructionEn as string;
	const instructionDe = content.instructionDe as string;

	if (instructionDe || !instructionEn) return;

	stats.total++;

	// Try to generate German instruction from English
	// This is a simple translation - for production you might want to use a translation API
	// For now, we'll just mark it for manual review
	results.push({
		questionId: question.id,
		type: 'word_order',
		issue: 'missing_german_instruction',
		action: 'manual',
		details: `instructionEn: "${instructionEn}" - needs manual German translation`
	});
	stats.manual++;
}

async function fixTranslationQuestion(
	db: ReturnType<typeof drizzle>,
	question: typeof schema.questions.$inferSelect,
	content: Record<string, unknown>,
	vocabLookup: Map<string, VocabItem>,
	results: FixResult[],
	stats: FixStats
) {
	const direction = content.direction as string;
	const textEn = content.textEn as string;
	const textDe = content.textDe as string;

	// For native_to_es, check if German is missing
	if (direction === 'native_to_es' && textEn && !textDe) {
		stats.total++;

		// Try to find German from vocabulary
		const vocab = vocabLookup.get(textEn.toLowerCase());

		if (vocab) {
			try {
				await db
					.update(questions)
					.set({ content: { ...content, textDe: vocab.de } })
					.where(eq(questions.id, question.id));

				results.push({
					questionId: question.id,
					type: 'translation',
					issue: 'missing_german',
					action: 'fixed',
					details: `Added textDe: "${vocab.de}" for textEn: "${textEn}"`
				});
				stats.fixed++;
			} catch (error) {
				results.push({
					questionId: question.id,
					type: 'translation',
					issue: 'missing_german',
					action: 'skipped',
					details: `Failed to update: ${error}`
				});
				stats.skipped++;
			}
		} else {
			results.push({
				questionId: question.id,
				type: 'translation',
				issue: 'missing_german',
				action: 'manual',
				details: `textEn: "${textEn}" - vocabulary not found for German translation`
			});
			stats.manual++;
		}
	}
}

async function fixFillBlankQuestion(
	db: ReturnType<typeof drizzle>,
	question: typeof schema.questions.$inferSelect,
	content: Record<string, unknown>,
	vocabLookup: Map<string, VocabItem>,
	results: FixResult[],
	stats: FixStats
) {
	const hintEn = content.hintEn as string;
	const hintDe = content.hintDe as string;
	const sentenceEn = content.sentenceEn as string;
	const sentenceDe = content.sentenceDe as string;

	let needsUpdate = false;
	const updates: Record<string, unknown> = { ...content };

	// Fix missing German hint
	if (hintEn && !hintDe) {
		const vocab = vocabLookup.get(hintEn.toLowerCase());
		if (vocab) {
			updates.hintDe = vocab.de;
			needsUpdate = true;
		}
	}

	// Fix missing German sentence (harder - needs proper translation)
	// Skip for now, mark as manual

	if (sentenceEn && !sentenceDe) {
		stats.total++;
		results.push({
			questionId: question.id,
			type: 'fill_blank',
			issue: 'missing_german_sentence',
			action: 'manual',
			details: `sentenceEn: "${sentenceEn}" - needs manual German translation`
		});
		stats.manual++;
		return;
	}

	if (!needsUpdate) return;

	stats.total++;

	try {
		await db.update(questions).set({ content: updates }).where(eq(questions.id, question.id));

		results.push({
			questionId: question.id,
			type: 'fill_blank',
			issue: 'missing_german_hint',
			action: 'fixed',
			details: `Added hintDe from vocabulary`
		});
		stats.fixed++;
	} catch (error) {
		results.push({
			questionId: question.id,
			type: 'fill_blank',
			issue: 'missing_german_hint',
			action: 'skipped',
			details: `Failed to update: ${error}`
		});
		stats.skipped++;
	}
}

async function fixMultipleChoiceQuestion(
	db: ReturnType<typeof drizzle>,
	question: typeof schema.questions.$inferSelect,
	content: Record<string, unknown>,
	results: FixResult[],
	stats: FixStats
) {
	const questionEn = content.questionEn as string;
	const questionDe = content.questionDe as string;

	if (questionDe || !questionEn) return;

	stats.total++;

	// Multiple choice question text needs manual translation
	results.push({
		questionId: question.id,
		type: 'multiple_choice',
		issue: 'missing_german_question',
		action: 'manual',
		details: `questionEn: "${questionEn}" - needs manual German translation`
	});
	stats.manual++;
}

function printSummary(stats: FixStats, results: FixResult[]) {
	console.log('\n═══════════════════════════════════════════════');
	console.log('📊 FIX SUMMARY');
	console.log('═══════════════════════════════════════════════\n');

	console.log(`Total issues processed: ${stats.total}`);
	console.log(`  ✅ Fixed: ${stats.fixed}`);
	console.log(`  ⏭️  Skipped: ${stats.skipped}`);
	console.log(`  📝 Manual review needed: ${stats.manual}`);

	// Group by action and type
	const fixed = results.filter((r) => r.action === 'fixed');
	const manual = results.filter((r) => r.action === 'manual');

	if (fixed.length > 0) {
		console.log('\n✅ FIXED ISSUES:');
		for (const result of fixed.slice(0, 10)) {
			console.log(`  • Question #${result.questionId} (${result.type}): ${result.details}`);
		}
		if (fixed.length > 10) {
			console.log(`  ... and ${fixed.length - 10} more`);
		}
	}

	if (manual.length > 0) {
		console.log('\n📝 NEEDS MANUAL REVIEW:');
		for (const result of manual.slice(0, 10)) {
			console.log(`  • Question #${result.questionId} (${result.type}): ${result.details}`);
		}
		if (manual.length > 10) {
			console.log(`  ... and ${manual.length - 10} more`);
		}
	}

	console.log('\n═══════════════════════════════════════════════\n');
}

// Run fixes
fixQuestions()
	.then(({ stats }) => {
		if (stats.fixed > 0) {
			console.log(`✅ Successfully fixed ${stats.fixed} issues.`);
		}
		if (stats.manual > 0) {
			console.log(`📝 ${stats.manual} issues need manual review.`);
		}
		if (stats.fixed === 0 && stats.manual === 0) {
			console.log('✅ No issues found that needed fixing!');
		}
		process.exit(0);
	})
	.catch((error) => {
		console.error('❌ Fix failed:', error);
		process.exit(1);
	});

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import 'dotenv/config';

const { questions, lessons, units } = schema;

interface AuditIssue {
	questionId: number;
	lessonId: number;
	type: string;
	issue: string;
	details: string;
}

interface AuditStats {
	totalQuestions: number;
	issuesFound: number;
	byType: Record<string, number>;
	byIssueType: Record<string, number>;
}

// Content interfaces for type checking
interface TranslationContent {
	text?: string;
	textEn?: string;
	textDe?: string;
	direction?: string;
}

interface MatchingContent {
	pairs?: Array<{
		spanish?: string;
		english?: string;
		german?: string;
	}>;
}

interface ListeningContent {
	textToHear?: string;
	answerType?: string;
	optionsEn?: string[];
	optionsDe?: string[];
}

interface WordOrderContent {
	words?: string[];
	instructionEn?: string;
	instructionDe?: string;
}

interface FillBlankContent {
	sentence?: string;
	sentenceEn?: string;
	sentenceDe?: string;
	hintEn?: string;
	hintDe?: string;
}

interface MultipleChoiceContent {
	questionEn?: string;
	questionDe?: string;
	options?: string[];
}

async function auditQuestions() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error('DATABASE_URL is not set');
	}

	const client = postgres(databaseUrl);
	const db = drizzle(client, { schema });

	console.log('🔍 Starting question audit...\n');

	const issues: AuditIssue[] = [];
	const stats: AuditStats = {
		totalQuestions: 0,
		issuesFound: 0,
		byType: {},
		byIssueType: {}
	};

	// Fetch all questions
	const allQuestions = await db.select().from(questions);
	stats.totalQuestions = allQuestions.length;

	console.log(`📊 Total questions to audit: ${stats.totalQuestions}\n`);

	for (const question of allQuestions) {
		const content = question.content as Record<string, unknown>;

		// Track by type
		stats.byType[question.type] = (stats.byType[question.type] || 0) + 1;

		// Audit based on question type
		switch (question.type) {
			case 'translation':
				auditTranslation(question, content as TranslationContent, issues, stats);
				break;
			case 'matching':
				auditMatching(question, content as MatchingContent, issues, stats);
				break;
			case 'listening':
				auditListening(question, content as ListeningContent, issues, stats);
				break;
			case 'word_order':
				auditWordOrder(question, content as WordOrderContent, issues, stats);
				break;
			case 'fill_blank':
				auditFillBlank(question, content as FillBlankContent, issues, stats);
				break;
			case 'multiple_choice':
				auditMultipleChoice(question, content as MultipleChoiceContent, issues, stats);
				break;
		}
	}

	stats.issuesFound = issues.length;

	// Print summary
	printSummary(stats, issues);

	// Print detailed issues
	if (issues.length > 0) {
		printDetailedIssues(issues);
	}

	await client.end();

	return { issues, stats };
}

function auditTranslation(
	question: typeof schema.questions.$inferSelect,
	content: TranslationContent,
	issues: AuditIssue[],
	stats: AuditStats
) {
	const { direction, text, textEn, textDe } = content;

	// Check direction
	if (!direction || !['native_to_es', 'es_to_native'].includes(direction)) {
		addIssue(issues, stats, question, 'invalid_direction', `Invalid or missing direction: "${direction}"`);
	}

	// Check content based on direction
	if (direction === 'native_to_es') {
		// Should have textEn and/or textDe
		if (!textEn && !textDe) {
			addIssue(issues, stats, question, 'missing_native_text', 'native_to_es missing both textEn and textDe');
		} else if (!textDe) {
			addIssue(issues, stats, question, 'missing_german', 'native_to_es missing textDe (German users will see English)');
		} else if (!textEn) {
			addIssue(issues, stats, question, 'missing_english', 'native_to_es missing textEn');
		}
	} else if (direction === 'es_to_native') {
		// Should have Spanish text
		if (!text) {
			addIssue(issues, stats, question, 'missing_spanish_text', 'es_to_native missing text (Spanish source)');
		}
	}
}

function auditMatching(
	question: typeof schema.questions.$inferSelect,
	content: MatchingContent,
	issues: AuditIssue[],
	stats: AuditStats
) {
	const { pairs } = content;

	if (!pairs || !Array.isArray(pairs) || pairs.length === 0) {
		addIssue(issues, stats, question, 'missing_pairs', 'Matching question has no pairs');
		return;
	}

	let missingGerman = 0;
	let missingEnglish = 0;
	let missingSpanish = 0;

	for (const pair of pairs) {
		if (!pair.spanish) missingSpanish++;
		if (!pair.english) missingEnglish++;
		if (!pair.german) missingGerman++;
	}

	if (missingSpanish > 0) {
		addIssue(issues, stats, question, 'missing_spanish', `${missingSpanish}/${pairs.length} pairs missing Spanish`);
	}
	if (missingEnglish > 0) {
		addIssue(issues, stats, question, 'missing_english', `${missingEnglish}/${pairs.length} pairs missing English`);
	}
	if (missingGerman > 0) {
		addIssue(issues, stats, question, 'missing_german', `${missingGerman}/${pairs.length} pairs missing German (German users will see English)`);
	}
}

function auditListening(
	question: typeof schema.questions.$inferSelect,
	content: ListeningContent,
	issues: AuditIssue[],
	stats: AuditStats
) {
	const { textToHear, answerType, optionsEn, optionsDe } = content;

	if (!textToHear) {
		addIssue(issues, stats, question, 'missing_audio_text', 'Listening question has no textToHear');
		return;
	}

	// Check if text is too short
	// Single words are hard to understand as audio
	// 2-word complete sentences (with punctuation) are acceptable
	const wordCount = textToHear.trim().split(/\s+/).length;
	const hasEndPunctuation = /[.!?]$/.test(textToHear.trim());

	// Only flag as too short if:
	// - Single word (always too short)
	// - 2 words without punctuation (likely just a phrase, not a sentence)
	if (wordCount === 1 || (wordCount === 2 && !hasEndPunctuation)) {
		addIssue(issues, stats, question, 'text_too_short', `textToHear is only ${wordCount} word(s): "${textToHear}"`);
	}

	// Check for bilingual options if multiple choice
	if (answerType === 'multiple_choice') {
		if (!optionsEn || optionsEn.length === 0) {
			addIssue(issues, stats, question, 'missing_english_options', 'Multiple choice listening missing optionsEn');
		}
		if (!optionsDe || optionsDe.length === 0) {
			addIssue(issues, stats, question, 'missing_german_options', 'Multiple choice listening missing optionsDe');
		}
	}
}

function auditWordOrder(
	question: typeof schema.questions.$inferSelect,
	content: WordOrderContent,
	issues: AuditIssue[],
	stats: AuditStats
) {
	const { words, instructionEn, instructionDe } = content;

	if (!words || words.length < 2) {
		addIssue(issues, stats, question, 'insufficient_words', 'Word order has fewer than 2 words');
	}

	if (!instructionEn) {
		addIssue(issues, stats, question, 'missing_english_instruction', 'Word order missing instructionEn');
	}
	if (!instructionDe) {
		addIssue(issues, stats, question, 'missing_german_instruction', 'Word order missing instructionDe (German users will see English)');
	}
}

function auditFillBlank(
	question: typeof schema.questions.$inferSelect,
	content: FillBlankContent,
	issues: AuditIssue[],
	stats: AuditStats
) {
	const { sentence, sentenceEn, sentenceDe, hintEn, hintDe } = content;

	// Check if we have sentence content
	if (!sentence && !sentenceEn && !sentenceDe) {
		addIssue(issues, stats, question, 'missing_sentence', 'Fill blank has no sentence content');
	}

	// If using bilingual sentences, check both are present
	if (sentenceEn && !sentenceDe) {
		addIssue(issues, stats, question, 'missing_german_sentence', 'Fill blank missing sentenceDe');
	}

	// Check hints
	if (hintEn && !hintDe) {
		addIssue(issues, stats, question, 'missing_german_hint', 'Fill blank missing hintDe');
	}
}

function auditMultipleChoice(
	question: typeof schema.questions.$inferSelect,
	content: MultipleChoiceContent,
	issues: AuditIssue[],
	stats: AuditStats
) {
	const { questionEn, questionDe, options } = content;

	if (!questionEn) {
		addIssue(issues, stats, question, 'missing_english_question', 'Multiple choice missing questionEn');
	}
	if (!questionDe) {
		addIssue(issues, stats, question, 'missing_german_question', 'Multiple choice missing questionDe');
	}
	if (!options || options.length < 2) {
		addIssue(issues, stats, question, 'insufficient_options', 'Multiple choice has fewer than 2 options');
	}
}

function addIssue(
	issues: AuditIssue[],
	stats: AuditStats,
	question: typeof schema.questions.$inferSelect,
	issueType: string,
	details: string
) {
	issues.push({
		questionId: question.id,
		lessonId: question.lessonId,
		type: question.type,
		issue: issueType,
		details
	});
	stats.byIssueType[issueType] = (stats.byIssueType[issueType] || 0) + 1;
}

function printSummary(stats: AuditStats, issues: AuditIssue[]) {
	console.log('═══════════════════════════════════════════════');
	console.log('📊 AUDIT SUMMARY');
	console.log('═══════════════════════════════════════════════\n');

	console.log(`Total questions audited: ${stats.totalQuestions}`);
	console.log(`Total issues found: ${stats.issuesFound}`);
	console.log(`Issue rate: ${((stats.issuesFound / stats.totalQuestions) * 100).toFixed(2)}%\n`);

	console.log('Questions by type:');
	for (const [type, count] of Object.entries(stats.byType).sort((a, b) => b[1] - a[1])) {
		console.log(`  • ${type}: ${count}`);
	}

	if (Object.keys(stats.byIssueType).length > 0) {
		console.log('\nIssues by type:');
		for (const [issue, count] of Object.entries(stats.byIssueType).sort((a, b) => b[1] - a[1])) {
			console.log(`  • ${issue}: ${count}`);
		}
	}

	console.log('\n═══════════════════════════════════════════════\n');
}

function printDetailedIssues(issues: AuditIssue[]) {
	console.log('📋 DETAILED ISSUES (first 50):');
	console.log('───────────────────────────────────────────────\n');

	const displayIssues = issues.slice(0, 50);
	for (const issue of displayIssues) {
		console.log(`Question #${issue.questionId} (${issue.type}) - Lesson #${issue.lessonId}`);
		console.log(`  Issue: ${issue.issue}`);
		console.log(`  Details: ${issue.details}\n`);
	}

	if (issues.length > 50) {
		console.log(`... and ${issues.length - 50} more issues\n`);
	}
}

// Run audit
auditQuestions()
	.then(({ issues, stats }) => {
		if (issues.length === 0) {
			console.log('✅ No issues found! All questions are properly configured.');
		} else {
			console.log(`⚠️  Found ${issues.length} issues that need attention.`);
			console.log('Run scripts/fix-questions.ts to auto-fix what can be fixed.');
		}
		process.exit(issues.length > 0 ? 1 : 0);
	})
	.catch((error) => {
		console.error('❌ Audit failed:', error);
		process.exit(1);
	});

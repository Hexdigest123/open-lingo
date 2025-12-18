import type { QuestionType } from '$lib/server/db/schema';

interface MultipleChoiceContent {
	questionEn: string;
	questionDe?: string;
	options: string[];
}

interface FillBlankContent {
	sentence?: string;
	sentenceEn?: string;
	sentenceDe?: string;
	hintEn?: string;
	hintDe?: string;
}

interface TranslationContent {
	text?: string;
	textEn?: string;
	textDe?: string;
	direction: 'native_to_es' | 'es_to_native';
}

interface MatchingContent {
	pairs: Array<{ spanish: string; english: string; german?: string }>;
}

interface WordOrderContent {
	words: string[];
	instructionEn?: string;
	instructionDe?: string;
}

interface SpeakingContent {
	textToSpeak: string;
	hintEn?: string;
	hintDe?: string;
}

interface ListeningContent {
	textToHear: string;
	answerType: 'type' | 'multiple_choice';
	options?: string[];
}

export type QuestionContent =
	| MultipleChoiceContent
	| FillBlankContent
	| TranslationContent
	| MatchingContent
	| WordOrderContent
	| SpeakingContent
	| ListeningContent;

export function validateQuestionContent(
	type: QuestionType,
	content: unknown
): string | null {
	if (!content || typeof content !== 'object') {
		return 'Question content is required';
	}

	const c = content as Record<string, unknown>;

	switch (type) {
		case 'multiple_choice': {
			if (!c.questionEn && !c.questionDe) {
				return 'At least one question text (English or German) is required';
			}
			if (!Array.isArray(c.options) || c.options.length < 2) {
				return 'At least 2 answer options are required';
			}
			if (c.options.length > 6) {
				return 'Maximum 6 answer options allowed';
			}
			if (c.options.some((opt: unknown) => typeof opt !== 'string' || !opt.trim())) {
				return 'All options must be non-empty strings';
			}
			break;
		}

		case 'fill_blank': {
			const hasSentence = c.sentence || c.sentenceEn || c.sentenceDe;
			if (!hasSentence) {
				return 'Sentence is required';
			}
			const sentence = (c.sentence || c.sentenceEn || c.sentenceDe) as string;
			if (!sentence.includes('_____')) {
				return 'Sentence must contain a blank (_____) for the answer';
			}
			break;
		}

		case 'translation': {
			if (!c.direction || !['native_to_es', 'es_to_native'].includes(c.direction as string)) {
				return 'Translation direction must be native_to_es or es_to_native';
			}
			if (c.direction === 'native_to_es') {
				if (!c.textEn && !c.textDe) {
					return 'Source text (English or German) is required for native_to_es';
				}
			} else {
				if (!c.text) {
					return 'Spanish text is required for es_to_native';
				}
			}
			break;
		}

		case 'matching': {
			if (!Array.isArray(c.pairs) || c.pairs.length < 2) {
				return 'At least 2 pairs are required for matching';
			}
			if (c.pairs.length > 6) {
				return 'Maximum 6 pairs allowed';
			}
			for (const pair of c.pairs as Array<Record<string, unknown>>) {
				if (!pair.spanish || typeof pair.spanish !== 'string') {
					return 'Each pair must have a Spanish word';
				}
				if (!pair.english || typeof pair.english !== 'string') {
					return 'Each pair must have an English word';
				}
			}
			break;
		}

		case 'word_order': {
			if (!Array.isArray(c.words) || c.words.length < 2) {
				return 'At least 2 words are required';
			}
			if (c.words.some((w: unknown) => typeof w !== 'string' || !w.trim())) {
				return 'All words must be non-empty strings';
			}
			if (!c.instructionEn && !c.instructionDe) {
				return 'At least one instruction (English or German) is required';
			}
			break;
		}

		case 'speaking': {
			if (!c.textToSpeak || typeof c.textToSpeak !== 'string') {
				return 'Text to speak is required';
			}
			break;
		}

		case 'listening': {
			if (!c.textToHear || typeof c.textToHear !== 'string') {
				return 'Text to hear is required';
			}
			if (!c.answerType || !['type', 'multiple_choice'].includes(c.answerType as string)) {
				return 'Answer type must be type or multiple_choice';
			}
			if (c.answerType === 'multiple_choice') {
				if (!Array.isArray(c.options) || c.options.length < 2) {
					return 'At least 2 options are required for multiple choice listening';
				}
			}
			break;
		}

		default:
			return `Unknown question type: ${type}`;
	}

	return null;
}

export function validateCorrectAnswer(
	type: QuestionType,
	content: unknown,
	correctAnswer: string
): string | null {
	if (!correctAnswer || !correctAnswer.trim()) {
		return 'Correct answer is required';
	}

	const c = content as Record<string, unknown>;

	switch (type) {
		case 'multiple_choice': {
			const options = c.options as string[];
			if (!options.includes(correctAnswer)) {
				return 'Correct answer must be one of the options';
			}
			break;
		}

		case 'matching': {
			if (correctAnswer !== 'all_matched') {
				return 'Correct answer for matching must be "all_matched"';
			}
			break;
		}

		case 'word_order': {
			const words = c.words as string[];
			// Correct answer should be the sentence formed from words
			const answerWords = correctAnswer.split(/\s+/);
			if (answerWords.length !== words.length) {
				return 'Correct answer word count must match the number of words provided';
			}
			break;
		}
	}

	return null;
}

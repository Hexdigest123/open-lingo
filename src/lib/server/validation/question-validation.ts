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
	direction: 'native_to_target' | 'target_to_native' | 'native_to_es' | 'es_to_native';
}

interface MatchingContent {
	pairs: Array<{ target: string; english: string; german?: string; spanish?: string }>;
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

interface CharacterRecognitionContent {
	character: string;
	options: string[];
	characterType: 'hiragana' | 'katakana' | 'kanji';
}

interface CharacterWritingContent {
	reading: string;
	characterType: 'hiragana' | 'katakana' | 'kanji';
}

interface ScriptTransliterationContent {
	sourceText: string;
	sourceScript: 'romaji' | 'hiragana' | 'katakana' | 'kanji';
	targetScript: 'romaji' | 'hiragana' | 'katakana';
}

interface ConjugationClozeContent {
	sentence: string;
	infinitive: string;
	targetTense: string;
}

interface ParticleSelectionContent {
	sentence: string;
	options: string[];
}

interface GrammarTransformationContent {
	sourceSentence: string;
	transformationType: string;
}

interface KanjiCompositionContent {
	targetKanji: string;
	radicals: unknown[];
	distractorRadicals: unknown[];
}

interface MinimalPairDiscriminationContent {
	audioText: string;
	options: Array<{ isCorrect: boolean }>;
}

interface DictationContent {
	textToHear: string;
	speed: 'normal' | 'slow';
}

interface GuidedCompositionContent {
	vocabularyHints: string[];
}

export type QuestionContent =
	| MultipleChoiceContent
	| FillBlankContent
	| TranslationContent
	| MatchingContent
	| WordOrderContent
	| SpeakingContent
	| ListeningContent
	| CharacterRecognitionContent
	| CharacterWritingContent
	| ScriptTransliterationContent
	| ConjugationClozeContent
	| ParticleSelectionContent
	| GrammarTransformationContent
	| KanjiCompositionContent
	| MinimalPairDiscriminationContent
	| DictationContent
	| GuidedCompositionContent;

export function validateQuestionContent(type: QuestionType, content: unknown): string | null {
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
			const validDirections = [
				'native_to_target',
				'target_to_native',
				'native_to_es',
				'es_to_native'
			];
			if (!c.direction || !validDirections.includes(c.direction as string)) {
				return 'Translation direction must be native_to_target or target_to_native';
			}
			const isNativeToTarget = c.direction === 'native_to_target' || c.direction === 'native_to_es';
			if (isNativeToTarget) {
				if (!c.textEn && !c.textDe) {
					return 'Source text (English or German) is required for native_to_target';
				}
			} else {
				if (!c.text) {
					return 'Target language text is required for target_to_native';
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
				if (
					!(pair.target || pair.spanish) ||
					(pair.target && typeof pair.target !== 'string') ||
					(pair.spanish && typeof pair.spanish !== 'string')
				) {
					return 'Each pair must have a target language word';
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

		case 'character_recognition': {
			if (!c.character || typeof c.character !== 'string') {
				return 'Character is required';
			}
			if (!Array.isArray(c.options) || c.options.length < 2) {
				return 'At least 2 options are required';
			}
			if (c.options.some((opt: unknown) => typeof opt !== 'string' || !opt.trim())) {
				return 'All options must be non-empty strings';
			}
			if (
				!c.characterType ||
				!['hiragana', 'katakana', 'kanji'].includes(c.characterType as string)
			) {
				return 'Character type must be hiragana, katakana, or kanji';
			}
			break;
		}

		case 'character_writing': {
			if (!c.reading || typeof c.reading !== 'string') {
				return 'Reading is required';
			}
			if (
				!c.characterType ||
				!['hiragana', 'katakana', 'kanji'].includes(c.characterType as string)
			) {
				return 'Character type must be hiragana, katakana, or kanji';
			}
			break;
		}

		case 'script_transliteration': {
			if (!c.sourceText || typeof c.sourceText !== 'string') {
				return 'Source text is required';
			}
			if (
				!c.sourceScript ||
				!['romaji', 'hiragana', 'katakana', 'kanji'].includes(c.sourceScript as string)
			) {
				return 'Source script must be romaji, hiragana, katakana, or kanji';
			}
			if (
				!c.targetScript ||
				!['romaji', 'hiragana', 'katakana'].includes(c.targetScript as string)
			) {
				return 'Target script must be romaji, hiragana, or katakana';
			}
			break;
		}

		case 'conjugation_cloze': {
			if (!c.sentence || typeof c.sentence !== 'string') {
				return 'Sentence is required';
			}
			if (!c.sentence.includes('_____')) {
				return 'Sentence must contain a blank (_____) for the answer';
			}
			if (!c.infinitive || typeof c.infinitive !== 'string') {
				return 'Infinitive is required';
			}
			if (!c.targetTense || typeof c.targetTense !== 'string') {
				return 'Target tense is required';
			}
			break;
		}

		case 'particle_selection': {
			if (!c.sentence || typeof c.sentence !== 'string') {
				return 'Sentence is required';
			}
			if (!Array.isArray(c.options) || c.options.length < 2) {
				return 'At least 2 options are required';
			}
			if (c.options.some((opt: unknown) => typeof opt !== 'string' || !opt.trim())) {
				return 'All options must be non-empty strings';
			}
			break;
		}

		case 'grammar_transformation': {
			if (!c.sourceSentence || typeof c.sourceSentence !== 'string') {
				return 'Source sentence is required';
			}
			if (!c.transformationType || typeof c.transformationType !== 'string') {
				return 'Transformation type is required';
			}
			break;
		}

		case 'kanji_composition': {
			if (!c.targetKanji || typeof c.targetKanji !== 'string') {
				return 'Target kanji is required';
			}
			if (!Array.isArray(c.radicals) || c.radicals.length < 1) {
				return 'At least 1 radical is required';
			}
			if (!Array.isArray(c.distractorRadicals)) {
				return 'Distractor radicals must be an array';
			}
			break;
		}

		case 'minimal_pair_discrimination': {
			if (!c.audioText || typeof c.audioText !== 'string') {
				return 'Audio text is required';
			}
			if (!Array.isArray(c.options) || c.options.length < 2) {
				return 'At least 2 options are required';
			}
			for (const option of c.options as Array<Record<string, unknown>>) {
				if (typeof option.isCorrect !== 'boolean') {
					return 'Each option must include an isCorrect boolean';
				}
			}
			break;
		}

		case 'dictation': {
			if (!c.textToHear || typeof c.textToHear !== 'string') {
				return 'Text to hear is required';
			}
			if (!c.speed || !['normal', 'slow'].includes(c.speed as string)) {
				return 'Speed must be normal or slow';
			}
			break;
		}

		case 'guided_composition': {
			if (!Array.isArray(c.vocabularyHints) || c.vocabularyHints.length < 1) {
				return 'At least 1 vocabulary hint is required';
			}
			if (c.vocabularyHints.some((hint: unknown) => typeof hint !== 'string' || !hint.trim())) {
				return 'All vocabulary hints must be non-empty strings';
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

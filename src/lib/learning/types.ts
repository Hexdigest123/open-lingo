import type {
	ConceptType,
	SkillType,
	SkillStatus,
	LessonMode,
	LessonBlockType,
	ConceptProgressStatus
} from '$lib/server/db/schema';

export type {
	ConceptType,
	SkillType,
	SkillStatus,
	LessonMode,
	LessonBlockType,
	ConceptProgressStatus
};

export interface LocalizedText {
	en: string;
	de: string;
}

export interface SRSResult {
	nextInterval: number;
	nextEasinessFactor: number;
	nextRepetitions: number;
	nextReviewAt: Date;
	quality: number;
}

export interface MasteryResult {
	conceptMastery: number;
	skillMastery: number;
}

export interface UnlockCheck {
	skillId: number;
	unlockable: boolean;
	unmetPrereqs: Array<{
		prerequisiteSkillId: number;
		requiredMastery: number;
		currentMastery: number;
	}>;
}

export interface PlacementEstimate {
	level: string;
	confidence: number;
	questionsAnswered: number;
	correctCount: number;
}

export interface TeachBlockContent {
	conceptIds: number[];
	explanation: string;
	examples: Array<{
		target: string;
		translation: string;
		audioUrl?: string;
	}>;
	visualAid?: {
		type: 'table' | 'stroke_order' | 'diagram';
		payload: Record<string, unknown>;
	};
	tips?: string[];
}

export interface DrillBlockContent {
	conceptIds: number[];
	questionCount: number;
	passingScore: number;
}

export interface CheckpointBlockContent {
	passingScore: number;
	maxAttempts: number;
}

export interface SkillNode {
	id: number;
	key: string;
	type: SkillType;
	title: string;
	description: string | null;
	cefrLevel: string | null;
	iconName: string | null;
	order: number;
	status: SkillStatus;
	mastery: number;
	prerequisiteIds: number[];
	conceptCount: number;
}

export interface CharacterRecognitionContent {
	character: string;
	question: string;
	options: string[];
	characterType: 'hiragana' | 'katakana' | 'kanji';
}

export interface CharacterWritingContent {
	prompt: string;
	reading: string;
	hint?: string;
	characterType: 'hiragana' | 'katakana' | 'kanji';
}

export interface ScriptTransliterationContent {
	sourceText: string;
	sourceScript: 'romaji' | 'hiragana' | 'katakana' | 'kanji';
	targetScript: 'romaji' | 'hiragana' | 'katakana';
	hint?: string;
}

export interface ConjugationClozeContent {
	sentence: string;
	translation: string;
	infinitive: string;
	targetTense: string;
	targetPerson?: string;
	hint?: string;
}

export interface ParticleSelectionContent {
	sentence: string;
	translation: string;
	options: string[];
	hint?: string;
}

export interface GrammarTransformationContent {
	sourceSentence: string;
	instruction: string;
	transformationType: string;
	hint?: string;
}

export interface KanjiCompositionContent {
	targetKanji: string;
	meaning: string;
	radicals: Array<{ character: string; name: string }>;
	distractorRadicals: Array<{ character: string; name: string }>;
}

export interface MinimalPairContent {
	question: string;
	audioText: string;
	options: Array<{ text: string; isCorrect: boolean }>;
}

export interface DictationContent {
	textToHear: string;
	hint?: string;
	speed: 'normal' | 'slow';
}

export interface GuidedCompositionContent {
	prompt: string;
	vocabularyHints: string[];
	grammarPattern?: string;
	exampleAnswer?: string;
}

export interface HiraganaCharData {
	char: string;
	romaji: string;
	row: string;
	column: string;
	strokeCount: number;
	mnemonicEn: string;
	mnemonicDe: string;
	order: number;
}

export interface KatakanaCharData {
	char: string;
	romaji: string;
	row: string;
	column: string;
	strokeCount: number;
	mnemonicEn: string;
	mnemonicDe: string;
	order: number;
}

export interface KanjiData {
	char: string;
	meanings: string[];
	readingsOn: string[];
	readingsKun: string[];
	strokeCount: number;
	jlptLevel: number;
	radicals: string[];
	order: number;
}

export interface GrammarPointData {
	key: string;
	titleEn: string;
	titleDe: string;
	explanationEn: string;
	explanationDe: string;
	pattern: string;
	examples: Array<{ target: string; en: string; de: string }>;
	cefrLevel: string;
	order: number;
}

export interface ConjugationPatternData {
	infinitive: string;
	infinitiveEn: string;
	infinitiveDe: string;
	group: string;
	isIrregular: boolean;
	forms: Record<string, Record<string, string>>;
}

export interface SkillGraphDefinition {
	skills: Array<{
		key: string;
		type: SkillType;
		titleEn: string;
		titleDe: string;
		descriptionEn: string;
		descriptionDe: string;
		cefrLevel: string;
		iconName?: string;
		order: number;
		conceptKeys: string[];
	}>;
	prerequisites: Array<{
		skillKey: string;
		prerequisiteKey: string;
		minMastery?: number;
	}>;
}

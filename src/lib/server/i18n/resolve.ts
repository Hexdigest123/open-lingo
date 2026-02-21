/**
 * Server-side locale resolution for DB content.
 *
 * Resolves En/De field pairs to a single value based on the request locale.
 * This eliminates all client-side `getLocale() === 'de' ? fieldDe : fieldEn` ternaries.
 */

type Locale = 'en' | 'de';

/** Pick the locale-appropriate value from an En/De pair. */
export function pick<T>(en: T, de: T | null | undefined, locale: Locale): T {
	return locale === 'de' && de != null ? de : en;
}

/**
 * Resolve a bilingual JSON string (e.g. lessons.title: '{"en":"...","de":"..."}')
 * to the locale-appropriate value.
 */
export function pickFromJson(
	value: string | null | undefined,
	locale: Locale,
	fallback = ''
): string {
	if (!value) return fallback;
	try {
		const parsed = JSON.parse(value) as Record<string, string>;
		if (typeof parsed === 'object' && parsed !== null) {
			return parsed[locale] ?? parsed.en ?? fallback;
		}
		return value;
	} catch {
		return value;
	}
}

/**
 * Resolve all En/De suffixed fields in a question content JSONB object.
 *
 * Transforms: { questionEn: "...", questionDe: "...", options: [...] }
 * Into:       { question: "...", options: [...] }
 *
 * Known field pairs resolved:
 * - questionEn/De → question
 * - sentenceEn/De → sentence (overwrites legacy field)
 * - hintEn/De → hint (overwrites legacy field)
 * - textEn/De → text (overwrites legacy field)
 * - instructionEn/De → instruction
 * - promptEn/De → prompt
 * - meaningEn/De → meaning
 * - optionsEn/De → options (overwrites legacy field)
 * - correctAnswerEn/De → correctAnswer
 * - pairs[].english/german → pairs[].native
 */
export function resolveQuestionContent(
	content: Record<string, unknown>,
	locale: Locale
): Record<string, unknown> {
	const resolved = { ...content };

	// String field pairs: [resolvedKey, enKey, deKey, legacyKey?]
	const stringPairs: [string, string, string, string?][] = [
		['question', 'questionEn', 'questionDe', 'question'],
		['sentence', 'sentenceEn', 'sentenceDe', 'sentence'],
		['hint', 'hintEn', 'hintDe', 'hint'],
		['text', 'textEn', 'textDe', 'text'],
		['instruction', 'instructionEn', 'instructionDe'],
		['prompt', 'promptEn', 'promptDe'],
		['meaning', 'meaningEn', 'meaningDe'],
		['correctAnswer', 'correctAnswerEn', 'correctAnswerDe']
	];

	for (const [target, enKey, deKey, legacy] of stringPairs) {
		if (enKey in resolved || deKey in resolved) {
			const de = resolved[deKey];
			const en = resolved[enKey];
			const fallback = legacy ? resolved[legacy] : undefined;
			resolved[target] = locale === 'de' && de != null ? de : (en ?? fallback ?? '');
			delete resolved[enKey];
			delete resolved[deKey];
		}
	}

	// Array field pairs: optionsEn/De → options
	if ('optionsEn' in resolved || 'optionsDe' in resolved) {
		const de = resolved.optionsDe;
		const en = resolved.optionsEn;
		const fallback = resolved.options;
		resolved.options = locale === 'de' && Array.isArray(de) ? de : (en ?? fallback);
		delete resolved.optionsEn;
		delete resolved.optionsDe;
	}

	// Pairs array: resolve english/german to native
	if (Array.isArray(resolved.pairs)) {
		resolved.pairs = (resolved.pairs as Record<string, unknown>[]).map((pair) => {
			const native =
				locale === 'de' && typeof pair.german === 'string'
					? pair.german
					: typeof pair.english === 'string'
						? pair.english
						: '';
			return {
				...pair,
				native,
				// Keep target/spanish for the target language side
				target: (pair.target as string) || (pair.spanish as string) || ''
			};
		});
	}

	return resolved;
}

/**
 * Strip the correct answer from hint text so hints don't leak the solution
 * (e.g. character_writing hints like "い looks like two needles" where い is the answer).
 */
export function sanitizeHint(
	content: Record<string, unknown>,
	correctAnswer: string
): Record<string, unknown> {
	if (typeof content.hint === 'string' && correctAnswer) {
		const answer = correctAnswer.trim();
		if (answer && content.hint.includes(answer)) {
			return { ...content, hint: content.hint.replaceAll(answer, '…') };
		}
	}
	return content;
}

/**
 * Resolve column-per-language fields on a DB row to single fields.
 *
 * Transforms: { titleEn: "Hello", titleDe: "Hallo", descriptionEn: "...", descriptionDe: "..." }
 * Into:       { title: "Hello", description: "..." }  (for locale='en')
 */
export function resolveEntityFields<T extends Record<string, unknown>>(
	entity: T,
	locale: Locale,
	fieldPairs: [string, string, string][]
): Record<string, unknown> {
	const resolved: Record<string, unknown> = { ...entity };
	for (const [target, enKey, deKey] of fieldPairs) {
		const en = resolved[enKey];
		const de = resolved[deKey];
		resolved[target] = locale === 'de' && de != null ? de : en;
		delete resolved[enKey];
		delete resolved[deKey];
	}
	return resolved;
}

/** Standard field pairs for concepts table */
export const CONCEPT_FIELDS: [string, string, string][] = [
	['title', 'titleEn', 'titleDe'],
	['description', 'descriptionEn', 'descriptionDe']
];

/** Standard field pairs for skills table */
export const SKILL_FIELDS: [string, string, string][] = [
	['title', 'titleEn', 'titleDe'],
	['description', 'descriptionEn', 'descriptionDe']
];

/** Standard field pairs for lessonBlocks table */
export const LESSON_BLOCK_FIELDS: [string, string, string][] = [['title', 'titleEn', 'titleDe']];

/**
 * Resolve teach block config JSONB.
 *
 * Transforms: { explanationEn, explanationDe, tipsEn, tipsDe, examples[].en/de, visualAid.payload.* }
 * Into:       { explanation, tips, examples[].translation, visualAid.payload.* }
 */
export function resolveTeachBlockConfig(
	config: Record<string, unknown>,
	locale: Locale
): Record<string, unknown> {
	const resolved = { ...config };

	// explanationEn/De → explanation
	if ('explanationEn' in resolved || 'explanationDe' in resolved) {
		resolved.explanation =
			locale === 'de' && resolved.explanationDe != null
				? resolved.explanationDe
				: (resolved.explanationEn ?? '');
		delete resolved.explanationEn;
		delete resolved.explanationDe;
	}

	// tipsEn/De → tips
	if ('tipsEn' in resolved || 'tipsDe' in resolved) {
		resolved.tips =
			locale === 'de' && Array.isArray(resolved.tipsDe) ? resolved.tipsDe : (resolved.tipsEn ?? []);
		delete resolved.tipsEn;
		delete resolved.tipsDe;
	}

	// examples[].en/de → examples[].translation
	if (Array.isArray(resolved.examples)) {
		resolved.examples = (resolved.examples as Record<string, unknown>[]).map((ex) => {
			const translation =
				locale === 'de' && typeof ex.de === 'string' ? ex.de : ((ex.en as string) ?? '');
			const { en: _en, de: _de, ...rest } = ex;
			return { ...rest, translation };
		});
	}

	// Resolve visualAid.payload bilingual fields
	if (resolved.visualAid && typeof resolved.visualAid === 'object') {
		const va = { ...(resolved.visualAid as Record<string, unknown>) };
		if (va.payload && typeof va.payload === 'object') {
			const payload = { ...(va.payload as Record<string, unknown>) };
			// exampleEn/De → example
			if ('exampleEn' in payload || 'exampleDe' in payload) {
				payload.example =
					locale === 'de' && payload.exampleDe != null
						? payload.exampleDe
						: (payload.exampleEn ?? '');
				delete payload.exampleEn;
				delete payload.exampleDe;
			}
			// infinitiveEn/De → infinitiveTranslation
			if ('infinitiveEn' in payload || 'infinitiveDe' in payload) {
				payload.infinitiveTranslation =
					locale === 'de' && payload.infinitiveDe != null
						? payload.infinitiveDe
						: (payload.infinitiveEn ?? '');
				delete payload.infinitiveEn;
				delete payload.infinitiveDe;
			}
			va.payload = payload;
		}
		resolved.visualAid = va;
	}

	return resolved;
}

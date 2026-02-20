import type { QuestionType } from '$lib/server/db/schema';

function normalizeDefault(input: string): string {
	return input
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export function normalizeAnswer(input: string, questionType?: QuestionType): string {
	if (questionType === 'character_writing') {
		return input.trim().normalize('NFC');
	}

	if (questionType === 'kanji_composition') {
		return input
			.split(/[\s,|;]+/)
			.map((part) => part.trim().normalize('NFC'))
			.filter(Boolean)
			.sort((a, b) => a.localeCompare(b))
			.join(' ');
	}

	if (questionType === 'script_transliteration') {
		const trimmed = input.trim().normalize('NFC');
		if (/^[\p{Script=Latin}\p{Number}\s\-']+$/u.test(trimmed)) {
			return trimmed.toLowerCase();
		}
		return trimmed;
	}

	return normalizeDefault(input);
}

function splitAcceptableAnswers(raw: string, questionType?: QuestionType): string[] {
	const parts = raw.split(/[|;]+/).map((part) => normalizeAnswer(part, questionType));
	return parts.filter(Boolean);
}

export function isAnswerCorrect(
	userAnswer: string,
	correctAnswer: string,
	questionType?: QuestionType
): boolean {
	if (!userAnswer || !correctAnswer) return false;

	const normalizedAnswer = normalizeAnswer(userAnswer, questionType);
	const acceptableAnswers = splitAcceptableAnswers(correctAnswer, questionType);
	const candidates = acceptableAnswers.length
		? acceptableAnswers
		: [normalizeAnswer(correctAnswer, questionType)];

	return candidates.some((acceptable) => acceptable === normalizedAnswer);
}

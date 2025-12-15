export function normalizeAnswer(input: string): string {
	return input
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function splitAcceptableAnswers(raw: string): string[] {
	const parts = raw.split(/[\|;]+/).map((part) => normalizeAnswer(part));
	return parts.filter(Boolean);
}

export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
	if (!userAnswer || !correctAnswer) return false;

	const normalizedAnswer = normalizeAnswer(userAnswer);
	const acceptableAnswers = splitAcceptableAnswers(correctAnswer);
	const candidates = acceptableAnswers.length ? acceptableAnswers : [normalizeAnswer(correctAnswer)];

	return candidates.some((acceptable) => acceptable === normalizedAnswer);
}

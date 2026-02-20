import type { SRSResult } from './types';

/**
 * SM-2 spaced repetition algorithm.
 *
 * @param quality  0-5 response quality (5 = perfect, 0 = blackout)
 * @param easinessFactor  current EF (≥ 1.3)
 * @param intervalDays  current interval in days
 * @param repetitions  successful repetition count
 * @returns next SRS parameters + review date
 */
export function calculateNextReview(
	quality: number,
	easinessFactor: number,
	intervalDays: number,
	repetitions: number
): SRSResult {
	const q = Math.max(0, Math.min(5, quality));

	const nextEasinessFactor = Math.max(
		1.3,
		easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
	);

	let nextInterval: number;
	let nextRepetitions: number;

	if (q < 3) {
		nextRepetitions = 0;
		nextInterval = 1;
	} else {
		nextRepetitions = repetitions + 1;

		if (nextRepetitions === 1) {
			nextInterval = 1;
		} else if (nextRepetitions === 2) {
			nextInterval = 6;
		} else {
			nextInterval = Math.max(1, Math.round(intervalDays * nextEasinessFactor));
		}
	}

	const nextReviewAt = new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1000);

	return {
		nextInterval,
		nextEasinessFactor,
		nextRepetitions,
		nextReviewAt,
		quality: q
	};
}

/**
 * Derive SM-2 quality score from answer correctness and response time.
 *
 * Quality scale:
 *   5 — correct, fast (< 5 s)
 *   4 — correct, moderate (5-10 s)
 *   3 — correct, slow (> 10 s)
 *   2 — incorrect
 *   1 — incorrect, very slow / hint used (reserved)
 *   0 — blackout (reserved)
 */
export function qualityFromAnswer(isCorrect: boolean, responseTimeMs?: number): number {
	if (!isCorrect) {
		return 2;
	}

	if (responseTimeMs === undefined) {
		return 4;
	}

	if (responseTimeMs < 5000) {
		return 5;
	}
	if (responseTimeMs < 10000) {
		return 4;
	}
	return 3;
}

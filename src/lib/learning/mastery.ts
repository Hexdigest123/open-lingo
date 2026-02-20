import type { MasteryResult, ConceptProgressStatus } from './types';

/**
 * Calculate mastery for a single concept based on accuracy and retention.
 *
 * Formula: mastery = accuracy * 0.7 + retention * 0.3
 * - accuracy = correctAttempts / totalAttempts
 * - retention = clamp(intervalDays / 30, 0, 1) — longer intervals signal deeper retention
 */
export function calculateConceptMastery(
	totalAttempts: number,
	correctAttempts: number,
	intervalDays: number
): number {
	if (totalAttempts === 0) {
		return 0;
	}

	const accuracy = correctAttempts / totalAttempts;
	const retention = Math.min(1, Math.max(0, intervalDays / 30));
	return Math.min(1, Math.max(0, accuracy * 0.7 + retention * 0.3));
}

/**
 * Calculate aggregate mastery for a skill from its constituent concept masteries.
 *
 * Uses weighted average where each concept has a weight (default 1).
 */
export function calculateSkillMastery(
	conceptMasteries: Array<{ mastery: number; weight: number }>
): number {
	if (conceptMasteries.length === 0) {
		return 0;
	}

	let weightedSum = 0;
	let totalWeight = 0;

	for (const { mastery, weight } of conceptMasteries) {
		const w = Math.max(1, weight);
		weightedSum += mastery * w;
		totalWeight += w;
	}

	return totalWeight > 0 ? Math.min(1, Math.max(0, weightedSum / totalWeight)) : 0;
}

/**
 * Derive the concept progress status from a mastery score.
 */
export function getMasteryStatus(mastery: number): ConceptProgressStatus {
	if (mastery >= 0.9) {
		return 'mastered';
	}
	if (mastery >= 0.6) {
		return 'reviewing';
	}
	if (mastery > 0) {
		return 'learning';
	}
	return 'new';
}

/**
 * Convenience: compute both concept and skill mastery in one call.
 *
 * Useful when updating after an answer — compute the concept's new mastery,
 * then recalculate the owning skill's aggregate mastery.
 */
export function computeMasteryResult(
	conceptTotalAttempts: number,
	conceptCorrectAttempts: number,
	conceptIntervalDays: number,
	allConceptMasteries: Array<{ mastery: number; weight: number }>
): MasteryResult {
	const conceptMastery = calculateConceptMastery(
		conceptTotalAttempts,
		conceptCorrectAttempts,
		conceptIntervalDays
	);

	const skillMastery = calculateSkillMastery(allConceptMasteries);

	return { conceptMastery, skillMastery };
}

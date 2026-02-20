import { db } from '$lib/server/db';
import {
	skillConcepts,
	skillPrerequisites,
	skills,
	userConceptProgress,
	userSkillProgress,
	type ConceptProgressStatus,
	type UserConceptProgress,
	type UserSkillProgress
} from '$lib/server/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

const MASTERY_THRESHOLD = 0.9;

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function calculateSm2(
	prevEasinessFactor: number,
	prevIntervalDays: number,
	prevRepetitions: number,
	quality: number
): {
	nextEasinessFactor: number;
	nextIntervalDays: number;
	nextRepetitions: number;
} {
	const nextEasinessFactor = Math.max(
		1.3,
		prevEasinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
	);

	if (quality < 3) {
		return {
			nextEasinessFactor,
			nextIntervalDays: 1,
			nextRepetitions: 0
		};
	}

	const nextRepetitions = prevRepetitions + 1;
	let nextIntervalDays = 1;

	if (nextRepetitions === 1) {
		nextIntervalDays = 1;
	} else if (nextRepetitions === 2) {
		nextIntervalDays = 6;
	} else {
		nextIntervalDays = Math.max(1, Math.round(prevIntervalDays * nextEasinessFactor));
	}

	return {
		nextEasinessFactor,
		nextIntervalDays,
		nextRepetitions
	};
}

function calculateConceptMastery(
	totalAttempts: number,
	correctAttempts: number,
	intervalDays: number
): number {
	if (totalAttempts === 0) {
		return 0;
	}

	const accuracy = correctAttempts / totalAttempts;
	const retention = clamp(intervalDays / 30, 0, 1);
	return clamp(accuracy * 0.7 + retention * 0.3, 0, 1);
}

function getConceptStatus(mastery: number): ConceptProgressStatus {
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

export async function updateConceptProgress(
	userId: number,
	conceptId: number,
	isCorrect: boolean,
	responseTimeMs?: number
): Promise<UserConceptProgress> {
	const [existing] = await db
		.select()
		.from(userConceptProgress)
		.where(
			and(eq(userConceptProgress.userId, userId), eq(userConceptProgress.conceptId, conceptId))
		)
		.limit(1);

	const quality = isCorrect ? (responseTimeMs !== undefined && responseTimeMs > 10000 ? 4 : 5) : 2;
	const prevEasinessFactor = existing?.easinessFactor ?? 2.5;
	const prevIntervalDays = existing?.intervalDays ?? 1;
	const prevRepetitions = existing?.repetitions ?? 0;

	const { nextEasinessFactor, nextIntervalDays, nextRepetitions } = calculateSm2(
		prevEasinessFactor,
		prevIntervalDays,
		prevRepetitions,
		quality
	);

	const totalAttempts = (existing?.totalAttempts ?? 0) + 1;
	const correctAttempts = (existing?.correctAttempts ?? 0) + (isCorrect ? 1 : 0);
	const mastery = calculateConceptMastery(totalAttempts, correctAttempts, nextIntervalDays);
	const status = getConceptStatus(mastery);

	const now = new Date();
	const nextReviewAt = new Date(now.getTime() + nextIntervalDays * 24 * 60 * 60 * 1000);

	const [upserted] = await db
		.insert(userConceptProgress)
		.values({
			userId,
			conceptId,
			status,
			mastery,
			easinessFactor: nextEasinessFactor,
			intervalDays: nextIntervalDays,
			repetitions: nextRepetitions,
			totalAttempts,
			correctAttempts,
			nextReviewAt,
			lastReviewedAt: now,
			updatedAt: now
		})
		.onConflictDoUpdate({
			target: [userConceptProgress.userId, userConceptProgress.conceptId],
			set: {
				status,
				mastery,
				easinessFactor: nextEasinessFactor,
				intervalDays: nextIntervalDays,
				repetitions: nextRepetitions,
				totalAttempts,
				correctAttempts,
				nextReviewAt,
				lastReviewedAt: now,
				updatedAt: now
			}
		})
		.returning();

	return upserted;
}

export async function updateSkillProgress(
	userId: number,
	skillId: number
): Promise<UserSkillProgress> {
	const conceptLinks = await db
		.select({
			conceptId: skillConcepts.conceptId,
			weight: skillConcepts.weight
		})
		.from(skillConcepts)
		.where(eq(skillConcepts.skillId, skillId));

	const [existing] = await db
		.select()
		.from(userSkillProgress)
		.where(and(eq(userSkillProgress.userId, userId), eq(userSkillProgress.skillId, skillId)))
		.limit(1);

	let mastery = 0;
	if (conceptLinks.length > 0) {
		const conceptIds = conceptLinks.map((link) => link.conceptId);
		const progressRows = await db
			.select({
				conceptId: userConceptProgress.conceptId,
				mastery: userConceptProgress.mastery
			})
			.from(userConceptProgress)
			.where(
				and(
					eq(userConceptProgress.userId, userId),
					inArray(userConceptProgress.conceptId, conceptIds)
				)
			);

		const conceptMasteryById = new Map(progressRows.map((row) => [row.conceptId, row.mastery]));
		let weightedSum = 0;
		let totalWeight = 0;

		for (const link of conceptLinks) {
			const weight = Math.max(1, link.weight);
			weightedSum += (conceptMasteryById.get(link.conceptId) ?? 0) * weight;
			totalWeight += weight;
		}

		mastery = totalWeight > 0 ? weightedSum / totalWeight : 0;
	}

	const now = new Date();
	const status =
		mastery >= MASTERY_THRESHOLD
			? 'mastered'
			: existing?.status === 'locked'
				? 'locked'
				: mastery > 0
					? 'in_progress'
					: (existing?.status ?? 'unlocked');

	if (existing) {
		const [updated] = await db
			.update(userSkillProgress)
			.set({
				status,
				mastery,
				unlockedAt:
					existing.unlockedAt ?? (status !== 'locked' ? now : (existing.unlockedAt ?? null)),
				masteredAt: status === 'mastered' ? (existing.masteredAt ?? now) : null,
				updatedAt: now
			})
			.where(eq(userSkillProgress.id, existing.id))
			.returning();

		return updated;
	}

	const [inserted] = await db
		.insert(userSkillProgress)
		.values({
			userId,
			skillId,
			status,
			mastery,
			unlockedAt: status !== 'locked' ? now : null,
			masteredAt: status === 'mastered' ? now : null,
			updatedAt: now
		})
		.returning();

	return inserted;
}

export async function checkAndUnlockSkills(
	userId: number,
	languageCode: string
): Promise<number[]> {
	const [skillRows, progressRows] = await Promise.all([
		db.select({ id: skills.id }).from(skills).where(eq(skills.languageCode, languageCode)),
		db
			.select()
			.from(userSkillProgress)
			.innerJoin(skills, eq(skills.id, userSkillProgress.skillId))
			.where(and(eq(userSkillProgress.userId, userId), eq(skills.languageCode, languageCode)))
	]);

	const progressMap = new Map(
		progressRows.map((row) => [row.user_skill_progress.skillId, row.user_skill_progress])
	);
	const allSkillIds = skillRows.map((row) => row.id);
	const lockedSkillIds = allSkillIds.filter((skillId) => {
		const progress = progressMap.get(skillId);
		return !progress || progress.status === 'locked';
	});

	if (lockedSkillIds.length === 0) {
		return [];
	}

	const prerequisiteRows = await db
		.select({
			skillId: skillPrerequisites.skillId,
			prerequisiteSkillId: skillPrerequisites.prerequisiteSkillId,
			minMastery: skillPrerequisites.minMastery
		})
		.from(skillPrerequisites)
		.where(inArray(skillPrerequisites.skillId, lockedSkillIds));

	const prerequisitesBySkill = new Map<number, typeof prerequisiteRows>();
	for (const row of prerequisiteRows) {
		const current = prerequisitesBySkill.get(row.skillId) ?? [];
		current.push(row);
		prerequisitesBySkill.set(row.skillId, current);
	}

	const unlockableSkillIds = lockedSkillIds.filter((skillId) => {
		const prereqs = prerequisitesBySkill.get(skillId) ?? [];
		if (prereqs.length === 0) {
			return true;
		}

		return prereqs.every((prereq) => {
			const mastery = progressMap.get(prereq.prerequisiteSkillId)?.mastery ?? 0;
			return mastery >= prereq.minMastery;
		});
	});

	if (unlockableSkillIds.length === 0) {
		return [];
	}

	const now = new Date();

	for (const skillId of unlockableSkillIds) {
		const existing = progressMap.get(skillId);
		if (existing) {
			await db
				.update(userSkillProgress)
				.set({
					status: 'unlocked',
					unlockedAt: existing.unlockedAt ?? now,
					updatedAt: now
				})
				.where(eq(userSkillProgress.id, existing.id));
		} else {
			await db.insert(userSkillProgress).values({
				userId,
				skillId,
				status: 'unlocked',
				mastery: 0,
				unlockedAt: now,
				updatedAt: now
			});
		}
	}

	return unlockableSkillIds;
}

export async function getSkillProgressForUser(
	userId: number,
	languageCode: string
): Promise<UserSkillProgress[]> {
	const rows = await db
		.select({ progress: userSkillProgress })
		.from(userSkillProgress)
		.innerJoin(skills, eq(skills.id, userSkillProgress.skillId))
		.where(and(eq(userSkillProgress.userId, userId), eq(skills.languageCode, languageCode)));

	return rows.map((row) => row.progress);
}

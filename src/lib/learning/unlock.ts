import type { UnlockCheck } from './types';

/**
 * Check whether a single skill can be unlocked based on its prerequisites.
 *
 * A skill is unlockable when ALL prerequisite skills meet or exceed the
 * required mastery threshold (default 0.8).
 */
export function checkSkillUnlockable(
	skillId: number,
	prerequisites: Array<{
		prerequisiteSkillId: number;
		minMastery: number;
	}>,
	skillMasteryMap: Map<number, number>
): UnlockCheck {
	if (prerequisites.length === 0) {
		return { skillId, unlockable: true, unmetPrereqs: [] };
	}

	const unmetPrereqs: UnlockCheck['unmetPrereqs'] = [];

	for (const prereq of prerequisites) {
		const currentMastery = skillMasteryMap.get(prereq.prerequisiteSkillId) ?? 0;
		if (currentMastery < prereq.minMastery) {
			unmetPrereqs.push({
				prerequisiteSkillId: prereq.prerequisiteSkillId,
				requiredMastery: prereq.minMastery,
				currentMastery
			});
		}
	}

	return {
		skillId,
		unlockable: unmetPrereqs.length === 0,
		unmetPrereqs
	};
}

/**
 * From a set of locked skill IDs and their prerequisites, return the IDs of
 * skills that are now eligible for unlocking.
 *
 * @param lockedSkillIds  skill IDs currently locked for the user
 * @param prerequisitesBySkill  map: skillId → array of prerequisites
 * @param skillMasteryMap  map: skillId → current mastery (0-1)
 * @returns array of skill IDs that can be unlocked
 */
export function getUnlockableSkillIds(
	lockedSkillIds: number[],
	prerequisitesBySkill: Map<number, Array<{ prerequisiteSkillId: number; minMastery: number }>>,
	skillMasteryMap: Map<number, number>
): number[] {
	return lockedSkillIds.filter((skillId) => {
		const prereqs = prerequisitesBySkill.get(skillId) ?? [];
		const check = checkSkillUnlockable(skillId, prereqs, skillMasteryMap);
		return check.unlockable;
	});
}

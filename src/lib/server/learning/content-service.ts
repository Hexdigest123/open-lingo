import { db } from '$lib/server/db';
import {
	concepts,
	lessonBlocks,
	questionConcepts,
	questions,
	skillConcepts,
	skillPrerequisites,
	skills,
	userSkillProgress,
	type Concept,
	type LessonBlock,
	type Question,
	type Skill,
	type SkillStatus
} from '$lib/server/db/schema';
import type { SkillNode } from '$lib/learning/types';
import { and, asc, eq, inArray, sql } from 'drizzle-orm';
import { pick } from '$lib/server/i18n/resolve';

type Locale = 'en' | 'de';

type SkillWithConceptCount = Skill & { conceptCount: number };

export async function getSkillsForLanguage(languageCode: string): Promise<SkillWithConceptCount[]> {
	const rows = await db
		.select({
			skill: skills,
			conceptCount: sql<number>`count(${skillConcepts.conceptId})`
		})
		.from(skills)
		.leftJoin(skillConcepts, eq(skillConcepts.skillId, skills.id))
		.where(eq(skills.languageCode, languageCode))
		.groupBy(skills.id)
		.orderBy(asc(skills.order), asc(skills.id));

	return rows.map(({ skill, conceptCount }) => ({
		...skill,
		conceptCount: Number(conceptCount)
	}));
}

export async function getSkillWithConcepts(skillId: number): Promise<{
	skill: Skill;
	concepts: Concept[];
} | null> {
	const [skill] = await db.select().from(skills).where(eq(skills.id, skillId)).limit(1);

	if (!skill) {
		return null;
	}

	const linkedConcepts = await getConceptsForSkill(skillId);

	return {
		skill,
		concepts: linkedConcepts
	};
}

export async function getConceptsForSkill(skillId: number): Promise<Concept[]> {
	const rows = await db
		.select({ concept: concepts })
		.from(skillConcepts)
		.innerJoin(concepts, eq(concepts.id, skillConcepts.conceptId))
		.where(eq(skillConcepts.skillId, skillId))
		.orderBy(asc(concepts.order), asc(concepts.id));

	return rows.map((row) => row.concept);
}

export async function getLessonBlocksForLesson(lessonId: number): Promise<LessonBlock[]> {
	return db
		.select()
		.from(lessonBlocks)
		.where(eq(lessonBlocks.lessonId, lessonId))
		.orderBy(asc(lessonBlocks.order), asc(lessonBlocks.id));
}

export async function getQuestionsForConcepts(conceptIds: number[]): Promise<Question[]> {
	if (conceptIds.length === 0) {
		return [];
	}

	const rows = await db
		.select({ question: questions })
		.from(questionConcepts)
		.innerJoin(questions, eq(questions.id, questionConcepts.questionId))
		.where(inArray(questionConcepts.conceptId, conceptIds))
		.orderBy(asc(questions.id));

	const deduped = new Map<number, Question>();
	for (const row of rows) {
		deduped.set(row.question.id, row.question);
	}

	return [...deduped.values()];
}

export async function getSkillTree(
	languageCode: string,
	userId: number,
	locale: Locale
): Promise<SkillNode[]> {
	const [skillRows, prerequisiteRows, progressRows] = await Promise.all([
		db
			.select({
				skill: skills,
				conceptCount: sql<number>`count(${skillConcepts.conceptId})`
			})
			.from(skills)
			.leftJoin(skillConcepts, eq(skillConcepts.skillId, skills.id))
			.where(eq(skills.languageCode, languageCode))
			.groupBy(skills.id)
			.orderBy(asc(skills.order), asc(skills.id)),
		db
			.select({
				skillId: skillPrerequisites.skillId,
				prerequisiteSkillId: skillPrerequisites.prerequisiteSkillId
			})
			.from(skillPrerequisites)
			.innerJoin(skills, eq(skills.id, skillPrerequisites.skillId))
			.where(eq(skills.languageCode, languageCode)),
		db
			.select({
				skillId: userSkillProgress.skillId,
				status: userSkillProgress.status,
				mastery: userSkillProgress.mastery
			})
			.from(userSkillProgress)
			.innerJoin(skills, eq(skills.id, userSkillProgress.skillId))
			.where(and(eq(userSkillProgress.userId, userId), eq(skills.languageCode, languageCode)))
	]);

	const prerequisiteMap = new Map<number, number[]>();
	for (const row of prerequisiteRows) {
		const current = prerequisiteMap.get(row.skillId) ?? [];
		current.push(row.prerequisiteSkillId);
		prerequisiteMap.set(row.skillId, current);
	}

	const progressMap = new Map<
		number,
		{
			status: SkillStatus;
			mastery: number;
		}
	>();
	for (const row of progressRows) {
		progressMap.set(row.skillId, {
			status: row.status,
			mastery: row.mastery
		});
	}

	return skillRows.map(({ skill, conceptCount }) => {
		const progress = progressMap.get(skill.id);

		return {
			id: skill.id,
			key: skill.key,
			type: skill.type,
			title: pick(skill.titleEn, skill.titleDe, locale),
			description: pick(skill.descriptionEn, skill.descriptionDe, locale),
			cefrLevel: skill.cefrLevel,
			iconName: skill.iconName,
			order: skill.order,
			status: progress?.status ?? 'locked',
			mastery: progress?.mastery ?? 0,
			prerequisiteIds: prerequisiteMap.get(skill.id) ?? [],
			conceptCount: Number(conceptCount)
		};
	});
}

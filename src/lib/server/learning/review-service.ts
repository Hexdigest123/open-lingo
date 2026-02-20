import { db } from '$lib/server/db';
import {
	concepts,
	questionConcepts,
	questions,
	skillConcepts,
	userConceptProgress,
	userQuestionAttempts,
	type Concept,
	type Question,
	type UserConceptProgress
} from '$lib/server/db/schema';
import { and, asc, eq, lte, sql } from 'drizzle-orm';
import { updateConceptProgress, updateSkillProgress } from './progression-service';

export interface DueReviewItem {
	concept: Concept;
	progress: UserConceptProgress;
	question: Question;
}

export async function getDueReviewCount(userId: number, languageCode: string): Promise<number> {
	const now = new Date();

	const [row] = await db
		.select({ count: sql<number>`count(*)` })
		.from(userConceptProgress)
		.innerJoin(concepts, eq(concepts.id, userConceptProgress.conceptId))
		.where(
			and(
				eq(userConceptProgress.userId, userId),
				eq(concepts.languageCode, languageCode),
				lte(userConceptProgress.nextReviewAt, now)
			)
		);

	return Number(row?.count ?? 0);
}

export async function getDueReviews(
	userId: number,
	languageCode: string,
	limit = 20
): Promise<DueReviewItem[]> {
	const now = new Date();
	const dueRows = await db
		.select({
			concept: concepts,
			progress: userConceptProgress
		})
		.from(userConceptProgress)
		.innerJoin(concepts, eq(concepts.id, userConceptProgress.conceptId))
		.where(
			and(
				eq(userConceptProgress.userId, userId),
				eq(concepts.languageCode, languageCode),
				lte(userConceptProgress.nextReviewAt, now)
			)
		)
		.orderBy(asc(userConceptProgress.nextReviewAt), asc(userConceptProgress.id))
		.limit(limit);

	const items: DueReviewItem[] = [];

	for (const row of dueRows) {
		const [questionRow] = await db
			.select({ question: questions })
			.from(questionConcepts)
			.innerJoin(questions, eq(questions.id, questionConcepts.questionId))
			.where(eq(questionConcepts.conceptId, row.concept.id))
			.orderBy(sql`random()`)
			.limit(1);

		if (!questionRow) {
			continue;
		}

		items.push({
			concept: row.concept,
			progress: row.progress,
			question: questionRow.question
		});
	}

	return items;
}

export async function processReviewAnswer(
	userId: number,
	conceptId: number,
	questionId: number,
	answer: string,
	isCorrect: boolean
): Promise<{ mastery: number }> {
	await db.insert(userQuestionAttempts).values({
		userId,
		questionId,
		answer,
		isCorrect
	});

	const updatedConcept = await updateConceptProgress(userId, conceptId, isCorrect);

	const skillRows = await db
		.select({ skillId: skillConcepts.skillId })
		.from(skillConcepts)
		.where(eq(skillConcepts.conceptId, conceptId));

	await Promise.all(skillRows.map((row) => updateSkillProgress(userId, row.skillId)));

	return { mastery: updatedConcept.mastery };
}

import { db } from '$lib/server/db';
import {
	placementSessions,
	questionConcepts,
	questions,
	skills,
	userSkillProgress,
	concepts,
	type PlacementSession,
	type Question
} from '$lib/server/db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
const MAX_QUESTIONS = 25;

interface PlacementData {
	levelIndex: number;
	consecutiveCorrect: number;
	consecutiveWrong: number;
	askedQuestionIds: number[];
}

function parseData(session: PlacementSession): PlacementData {
	const raw = session.data as Record<string, unknown>;
	const asked = Array.isArray(raw.askedQuestionIds)
		? raw.askedQuestionIds.filter((value): value is number => typeof value === 'number')
		: [];

	return {
		levelIndex:
			typeof raw.levelIndex === 'number'
				? Math.min(LEVELS.length - 1, Math.max(0, raw.levelIndex))
				: 1,
		consecutiveCorrect:
			typeof raw.consecutiveCorrect === 'number' ? Math.max(0, raw.consecutiveCorrect) : 0,
		consecutiveWrong:
			typeof raw.consecutiveWrong === 'number' ? Math.max(0, raw.consecutiveWrong) : 0,
		askedQuestionIds: asked
	};
}

function getLevelFromIndex(levelIndex: number): (typeof LEVELS)[number] {
	return LEVELS[Math.min(LEVELS.length - 1, Math.max(0, levelIndex))];
}

function getLevelIndex(level: string | null): number {
	if (!level) {
		return 1;
	}
	const index = LEVELS.indexOf(level as (typeof LEVELS)[number]);
	return index >= 0 ? index : 1;
}

async function getRandomQuestionForLevel(
	languageCode: string,
	level: (typeof LEVELS)[number],
	askedQuestionIds: number[]
): Promise<Question | null> {
	const levelRows = await db
		.select({ question: questions })
		.from(questions)
		.innerJoin(questionConcepts, eq(questionConcepts.questionId, questions.id))
		.innerJoin(concepts, eq(concepts.id, questionConcepts.conceptId))
		.where(and(eq(concepts.languageCode, languageCode), eq(concepts.cefrLevel, level)))
		.orderBy(sql`random()`)
		.limit(50);

	const randomLevelQuestion = levelRows
		.map((row) => row.question)
		.find((question) => !askedQuestionIds.includes(question.id));

	if (randomLevelQuestion) {
		return randomLevelQuestion;
	}

	const fallbackRows = await db
		.select({ question: questions })
		.from(questions)
		.innerJoin(questionConcepts, eq(questionConcepts.questionId, questions.id))
		.innerJoin(concepts, eq(concepts.id, questionConcepts.conceptId))
		.where(eq(concepts.languageCode, languageCode))
		.orderBy(sql`random()`)
		.limit(50);

	return (
		fallbackRows
			.map((row) => row.question)
			.find((question) => !askedQuestionIds.includes(question.id)) ?? null
	);
}

export async function startPlacement(userId: number, languageCode: string): Promise<number> {
	const [session] = await db
		.insert(placementSessions)
		.values({
			userId,
			languageCode,
			estimatedLevel: 'A2',
			totalQuestions: 0,
			correctCount: 0,
			data: {
				levelIndex: 1,
				consecutiveCorrect: 0,
				consecutiveWrong: 0,
				askedQuestionIds: []
			}
		})
		.returning({ id: placementSessions.id });

	return session.id;
}

export async function getNextPlacementQuestion(sessionId: number): Promise<{
	question: Question;
	estimatedLevel: string;
} | null> {
	const [session] = await db
		.select()
		.from(placementSessions)
		.where(eq(placementSessions.id, sessionId))
		.limit(1);

	if (!session || session.completedAt || session.totalQuestions >= MAX_QUESTIONS) {
		return null;
	}

	const data = parseData(session);
	const levelIndex = Number.isFinite(data.levelIndex)
		? data.levelIndex
		: getLevelIndex(session.estimatedLevel);
	const estimatedLevel = getLevelFromIndex(levelIndex);

	const question = await getRandomQuestionForLevel(
		session.languageCode,
		estimatedLevel,
		data.askedQuestionIds
	);

	if (!question) {
		return null;
	}

	return {
		question,
		estimatedLevel
	};
}

export async function submitPlacementAnswer(
	sessionId: number,
	questionId: number,
	isCorrect: boolean
): Promise<void> {
	const [session] = await db
		.select()
		.from(placementSessions)
		.where(eq(placementSessions.id, sessionId))
		.limit(1);

	if (!session || session.completedAt) {
		return;
	}

	const data = parseData(session);
	const askedQuestionIds = data.askedQuestionIds.includes(questionId)
		? data.askedQuestionIds
		: [...data.askedQuestionIds, questionId];

	let levelIndex = data.levelIndex;
	let consecutiveCorrect = isCorrect ? data.consecutiveCorrect + 1 : 0;
	let consecutiveWrong = isCorrect ? 0 : data.consecutiveWrong + 1;

	if (consecutiveCorrect >= 3) {
		levelIndex = Math.min(LEVELS.length - 1, levelIndex + 1);
		consecutiveCorrect = 0;
		consecutiveWrong = 0;
	} else if (consecutiveWrong >= 2) {
		levelIndex = Math.max(0, levelIndex - 1);
		consecutiveCorrect = 0;
		consecutiveWrong = 0;
	}

	const estimatedLevel = getLevelFromIndex(levelIndex);

	await db
		.update(placementSessions)
		.set({
			totalQuestions: session.totalQuestions + 1,
			correctCount: session.correctCount + (isCorrect ? 1 : 0),
			estimatedLevel,
			data: {
				levelIndex,
				consecutiveCorrect,
				consecutiveWrong,
				askedQuestionIds
			}
		})
		.where(eq(placementSessions.id, sessionId));
}

export async function completePlacement(sessionId: number): Promise<string | null> {
	const [session] = await db
		.select()
		.from(placementSessions)
		.where(eq(placementSessions.id, sessionId))
		.limit(1);

	if (!session) {
		return null;
	}

	const data = parseData(session);
	const estimatedLevel = getLevelFromIndex(data.levelIndex);
	const now = new Date();

	await db
		.update(placementSessions)
		.set({
			estimatedLevel,
			completedAt: now
		})
		.where(eq(placementSessions.id, sessionId));

	const allSkillRows = await db
		.select({
			id: skills.id,
			cefrLevel: skills.cefrLevel
		})
		.from(skills)
		.where(eq(skills.languageCode, session.languageCode));

	const maxLevelIndex = getLevelIndex(estimatedLevel);
	const eligibleSkillIds = allSkillRows
		.filter((row) => {
			if (!row.cefrLevel) {
				return true;
			}
			return getLevelIndex(row.cefrLevel) <= maxLevelIndex;
		})
		.map((row) => row.id);

	if (eligibleSkillIds.length === 0) {
		return estimatedLevel;
	}

	const existingRows = await db
		.select()
		.from(userSkillProgress)
		.where(
			and(
				eq(userSkillProgress.userId, session.userId),
				inArray(userSkillProgress.skillId, eligibleSkillIds)
			)
		);

	const existingBySkillId = new Map(existingRows.map((row) => [row.skillId, row]));

	for (const skillId of eligibleSkillIds) {
		const existing = existingBySkillId.get(skillId);
		if (!existing) {
			await db.insert(userSkillProgress).values({
				userId: session.userId,
				skillId,
				status: 'unlocked',
				mastery: 0,
				unlockedAt: now,
				updatedAt: now
			});
			continue;
		}

		if (existing.status === 'locked') {
			await db
				.update(userSkillProgress)
				.set({
					status: 'unlocked',
					unlockedAt: existing.unlockedAt ?? now,
					updatedAt: now
				})
				.where(eq(userSkillProgress.id, existing.id));
		}
	}

	return estimatedLevel;
}

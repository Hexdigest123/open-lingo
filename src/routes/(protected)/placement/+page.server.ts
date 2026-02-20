import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { placementSessions, questions, users } from '$lib/server/db/schema';
import {
	completePlacement,
	getNextPlacementQuestion,
	startPlacement,
	submitPlacementAnswer
} from '$lib/server/learning/placement-service';
import { isAnswerCorrect } from '$lib/server/validation/answers';
import { and, desc, eq, isNull } from 'drizzle-orm';

const MAX_QUESTIONS = 25;

export const load: PageServerLoad = async ({ locals, url }) => {
	const userId = locals.user!.id;

	const [userLanguage] = await db
		.select({ activeLanguage: users.activeLanguage })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	const languageCode = userLanguage?.activeLanguage ?? 'es';

	const sessionIdParam = url.searchParams.get('sessionId');
	const parsedSessionId = sessionIdParam ? Number.parseInt(sessionIdParam, 10) : NaN;

	const [activeSession] = Number.isFinite(parsedSessionId)
		? await db
				.select({
					id: placementSessions.id,
					currentLevel: placementSessions.estimatedLevel,
					questionsAnswered: placementSessions.totalQuestions
				})
				.from(placementSessions)
				.where(
					and(
						eq(placementSessions.id, parsedSessionId),
						eq(placementSessions.userId, userId),
						eq(placementSessions.languageCode, languageCode),
						isNull(placementSessions.completedAt)
					)
				)
				.limit(1)
		: await db
				.select({
					id: placementSessions.id,
					currentLevel: placementSessions.estimatedLevel,
					questionsAnswered: placementSessions.totalQuestions
				})
				.from(placementSessions)
				.where(
					and(
						eq(placementSessions.userId, userId),
						eq(placementSessions.languageCode, languageCode),
						isNull(placementSessions.completedAt)
					)
				)
				.orderBy(desc(placementSessions.id))
				.limit(1);

	const nextQuestion = activeSession ? await getNextPlacementQuestion(activeSession.id) : null;

	return {
		languageCode,
		activeSession: activeSession
			? {
					id: activeSession.id,
					currentLevel: activeSession.currentLevel ?? 'A2',
					questionsAnswered: activeSession.questionsAnswered
				}
			: null,
		nextQuestion,
		maxQuestions: MAX_QUESTIONS
	};
};

export const actions: Actions = {
	start: async ({ locals }) => {
		const userId = locals.user!.id;

		const [userLanguage] = await db
			.select({ activeLanguage: users.activeLanguage })
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		const languageCode = userLanguage?.activeLanguage ?? 'es';
		const sessionId = await startPlacement(userId, languageCode);
		const nextQuestion = await getNextPlacementQuestion(sessionId);

		return {
			sessionId,
			nextQuestion,
			estimatedLevel: nextQuestion?.estimatedLevel ?? 'A2',
			questionsAnswered: 0,
			maxQuestions: MAX_QUESTIONS
		};
	},
	answer: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();

		const sessionId = Number.parseInt(data.get('sessionId')?.toString() ?? '', 10);
		const questionId = Number.parseInt(data.get('questionId')?.toString() ?? '', 10);
		const answer = data.get('answer')?.toString().trim() ?? '';

		if (!Number.isFinite(sessionId) || !Number.isFinite(questionId) || !answer) {
			return fail(400, { error: 'Missing placement answer payload' });
		}

		const [session] = await db
			.select({
				id: placementSessions.id,
				userId: placementSessions.userId,
				estimatedLevel: placementSessions.estimatedLevel,
				totalQuestions: placementSessions.totalQuestions
			})
			.from(placementSessions)
			.where(and(eq(placementSessions.id, sessionId), eq(placementSessions.userId, userId)))
			.limit(1);

		if (!session) {
			return fail(404, { error: 'Placement session not found' });
		}

		const [question] = await db
			.select({ correctAnswer: questions.correctAnswer })
			.from(questions)
			.where(eq(questions.id, questionId))
			.limit(1);

		if (!question) {
			return fail(404, { error: 'Placement question not found' });
		}

		const isCorrect = isAnswerCorrect(answer, question.correctAnswer);
		await submitPlacementAnswer(sessionId, questionId, isCorrect);

		const [updatedSession] = await db
			.select({
				estimatedLevel: placementSessions.estimatedLevel,
				totalQuestions: placementSessions.totalQuestions
			})
			.from(placementSessions)
			.where(eq(placementSessions.id, sessionId))
			.limit(1);

		const nextQuestion = await getNextPlacementQuestion(sessionId);

		return {
			isCorrect,
			correctAnswer: question.correctAnswer,
			nextQuestion,
			estimatedLevel: updatedSession?.estimatedLevel ?? session.estimatedLevel ?? 'A2',
			questionsAnswered: updatedSession?.totalQuestions ?? session.totalQuestions + 1,
			maxQuestions: MAX_QUESTIONS
		};
	},
	complete: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const sessionId = Number.parseInt(data.get('sessionId')?.toString() ?? '', 10);

		if (!Number.isFinite(sessionId)) {
			return fail(400, { error: 'Missing session id' });
		}

		const [session] = await db
			.select({ id: placementSessions.id })
			.from(placementSessions)
			.where(and(eq(placementSessions.id, sessionId), eq(placementSessions.userId, userId)))
			.limit(1);

		if (!session) {
			return fail(404, { error: 'Placement session not found' });
		}

		const estimatedLevel = await completePlacement(sessionId);
		if (!estimatedLevel) {
			return fail(500, { error: 'Could not complete placement session' });
		}

		return {
			estimatedLevel,
			redirectTo: '/skills'
		};
	}
};

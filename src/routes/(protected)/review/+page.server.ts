import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { questions, users } from '$lib/server/db/schema';
import {
	getDueReviewCount,
	getDueReviews,
	processReviewAnswer
} from '$lib/server/learning/review-service';
import { isAnswerCorrect } from '$lib/server/validation/answers';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const [userLanguage] = await db
		.select({ activeLanguage: users.activeLanguage })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	const languageCode = userLanguage?.activeLanguage ?? 'es';

	const [reviews, totalDue] = await Promise.all([
		getDueReviews(userId, languageCode, 20),
		getDueReviewCount(userId, languageCode)
	]);

	return {
		reviews,
		totalDue,
		languageCode
	};
};

export const actions: Actions = {
	answer: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();

		const conceptId = Number.parseInt(data.get('conceptId')?.toString() ?? '', 10);
		const questionId = Number.parseInt(data.get('questionId')?.toString() ?? '', 10);
		const answer = data.get('answer')?.toString().trim() ?? '';

		if (!Number.isFinite(conceptId) || !Number.isFinite(questionId) || !answer) {
			return fail(400, { error: 'Missing answer payload' });
		}

		const [question] = await db
			.select({ correctAnswer: questions.correctAnswer })
			.from(questions)
			.where(eq(questions.id, questionId))
			.limit(1);

		if (!question) {
			return fail(404, { error: 'Question not found' });
		}

		const isCorrect = isAnswerCorrect(answer, question.correctAnswer);
		const result = await processReviewAnswer(userId, conceptId, questionId, answer, isCorrect);

		return {
			isCorrect,
			correctAnswer: question.correctAnswer,
			mastery: result.mastery
		};
	}
};

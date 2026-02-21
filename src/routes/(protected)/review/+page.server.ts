import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { questions, userStats, users } from '$lib/server/db/schema';
import {
	getDueReviewCount,
	getDueReviews,
	processReviewAnswer
} from '$lib/server/learning/review-service';
import { recordCorrectAnswer } from '$lib/server/learning/streak-service';
import { updateChallengeProgress } from '$lib/server/learning/challenge-service';
import { isAnswerCorrect } from '$lib/server/validation/answers';
import { eq } from 'drizzle-orm';
import {
	resolveEntityFields,
	resolveQuestionContent,
	sanitizeHint,
	CONCEPT_FIELDS
} from '$lib/server/i18n/resolve';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const [userLanguage] = await db
		.select({ activeLanguage: users.activeLanguage })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	const languageCode = userLanguage?.activeLanguage ?? 'es';

	const locale = locals.locale;

	const [rawReviews, totalDue] = await Promise.all([
		getDueReviews(userId, languageCode, 20),
		getDueReviewCount(userId, languageCode)
	]);

	const reviews = rawReviews.map((item) => {
		let content = item.question.content
			? resolveQuestionContent(item.question.content as Record<string, unknown>, locale)
			: (item.question.content as Record<string, unknown>);
		if (content) {
			content = sanitizeHint(content, item.question.correctAnswer);
		}
		return {
			...item,
			concept: resolveEntityFields(item.concept, locale, CONCEPT_FIELDS),
			question: { ...item.question, content }
		};
	});

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
		const comboMultiplierRaw = Number.parseInt(data.get('comboMultiplier')?.toString() ?? '1', 10);
		const comboMultiplier = Number.isFinite(comboMultiplierRaw)
			? Math.max(1, comboMultiplierRaw)
			: 1;
		const isSessionComplete = data.get('isSessionComplete')?.toString() === 'true';

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

		let firstCorrectToday = false;
		let xpGain = 0;
		let streakMilestone: number | null = null;
		let previousLevel = 1;
		let newLevel = 1;

		if (isCorrect) {
			const [stats] = await db
				.select()
				.from(userStats)
				.where(eq(userStats.userId, userId))
				.limit(1);

			const streakResult = await recordCorrectAnswer(userId, stats, true, comboMultiplier);
			firstCorrectToday = streakResult.firstCorrectToday;
			xpGain = streakResult.xpGain;
			streakMilestone = streakResult.streakMilestone;
			previousLevel = streakResult.previousLevel;
			newLevel = streakResult.newLevel;

			await updateChallengeProgress(userId, 'correct_answers', 1);
		}

		if (isSessionComplete) {
			await updateChallengeProgress(userId, 'review_sessions', 1);
		}

		return {
			isCorrect,
			correctAnswer: question.correctAnswer,
			mastery: result.mastery,
			firstCorrectToday,
			xpGain,
			streakMilestone,
			previousLevel,
			newLevel
		};
	}
};

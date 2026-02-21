import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { dailyStreaks, languages, userStats, users } from '$lib/server/db/schema';
import { getDueReviewCount } from '$lib/server/learning/review-service';
import {
	ensureUserChallenges,
	generateWeeklyChallenges,
	getActiveWeeklyChallenges
} from '$lib/server/learning/challenge-service';
import { and, asc, eq, gte, lte, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent, locals }) => {
	const { user, stats, activeLanguage } = await parent();
	const userId = locals.user!.id;
	const userWithLanguage = user as unknown as { activeLanguage?: string } | null;
	const languageCode = userWithLanguage?.activeLanguage ?? activeLanguage?.code ?? 'es';
	const dueReviewCount = await getDueReviewCount(userId, languageCode);

	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);
	const todayEnd = new Date();
	todayEnd.setHours(23, 59, 59, 999);

	const [[dailyXpRow], [userGamificationStats]] = await Promise.all([
		db
			.select({
				xpEarned: sql<number>`coalesce(sum(${dailyStreaks.xpEarned}), 0)`
			})
			.from(dailyStreaks)
			.where(
				and(
					eq(dailyStreaks.userId, userId),
					gte(dailyStreaks.activityDate, todayStart),
					lte(dailyStreaks.activityDate, todayEnd)
				)
			),
		db
			.select({
				dailyXpGoal: userStats.dailyXpGoal,
				gems: userStats.gems
			})
			.from(userStats)
			.where(eq(userStats.userId, userId))
			.limit(1)
	]);

	await generateWeeklyChallenges();
	let activeWeeklyChallenges = await getActiveWeeklyChallenges(userId);

	if (activeWeeklyChallenges.length > 0) {
		await ensureUserChallenges(
			userId,
			activeWeeklyChallenges.map(({ challenge }) => challenge.id)
		);
		activeWeeklyChallenges = await getActiveWeeklyChallenges(userId);
	}

	const availableLanguages = await db
		.select({
			code: languages.code,
			name: languages.name,
			nativeName: languages.nativeName,
			flagEmoji: languages.flagEmoji
		})
		.from(languages)
		.where(eq(languages.isActive, true))
		.orderBy(asc(languages.order));

	const weeklyChallenges = activeWeeklyChallenges.map(({ challenge, progress, userChallenge }) => ({
		...challenge,
		progress,
		completedAt: userChallenge?.completedAt ?? null,
		xpAwarded: userChallenge?.xpAwarded ?? false
	}));

	return {
		user,
		stats,
		activeLanguage,
		availableLanguages,
		dueReviewCount,
		dailyXpProgress: dailyXpRow?.xpEarned ?? 0,
		dailyXpGoal: userGamificationStats?.dailyXpGoal ?? 20,
		gems: userGamificationStats?.gems ?? 0,
		weeklyChallenges
	};
};

export const actions: Actions = {
	changeLanguage: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const languageCode = data.get('languageCode')?.toString().trim();

		if (!languageCode) {
			return fail(400, { languageError: 'Language is required' });
		}

		const [language] = await db
			.select({ code: languages.code })
			.from(languages)
			.where(eq(languages.code, languageCode))
			.limit(1);

		if (!language) {
			return fail(400, { languageError: 'Invalid language' });
		}

		await db
			.update(users)
			.set({ activeLanguage: languageCode, updatedAt: new Date() })
			.where(eq(users.id, userId));

		return { languageSuccess: true };
	}
};

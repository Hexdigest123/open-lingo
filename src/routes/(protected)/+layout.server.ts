import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { languages, userStats, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		redirect(303, `/login?redirect=${encodeURIComponent(url.pathname)}`);
	}

	// Redirect to onboarding if not completed (except when already on onboarding page)
	if (!locals.user.onboardingCompleted && url.pathname !== '/onboarding') {
		redirect(303, '/onboarding');
	}

	// Fetch user stats for gamification display
	const [stats] = await db
		.select()
		.from(userStats)
		.where(eq(userStats.userId, locals.user.id))
		.limit(1);

	const [user] = await db
		.select({ locale: users.locale, activeLanguage: users.activeLanguage })
		.from(users)
		.where(eq(users.id, locals.user.id))
		.limit(1);

	const activeLanguageCode = user?.activeLanguage ?? 'es';

	let [activeLanguage] = await db
		.select({
			code: languages.code,
			name: languages.name,
			nativeName: languages.nativeName,
			flagEmoji: languages.flagEmoji,
			whisperCode: languages.whisperCode,
			tutorName: languages.tutorName,
			tutorGreeting: languages.tutorGreeting
		})
		.from(languages)
		.where(eq(languages.code, activeLanguageCode))
		.limit(1);

	if (!activeLanguage && activeLanguageCode !== 'es') {
		[activeLanguage] = await db
			.select({
				code: languages.code,
				name: languages.name,
				nativeName: languages.nativeName,
				flagEmoji: languages.flagEmoji,
				whisperCode: languages.whisperCode,
				tutorName: languages.tutorName,
				tutorGreeting: languages.tutorGreeting
			})
			.from(languages)
			.where(eq(languages.code, 'es'))
			.limit(1);
	}

	// Calculate current hearts (regenerate over time - 5 hearts per 30 minutes, max 10)
	let currentHearts = stats?.hearts ?? 10;
	let heartsUpdated = false;

	if (stats) {
		const now = new Date();
		const lastRefill = new Date(stats.heartsLastRefilled);
		const halfHoursSinceRefill = Math.floor(
			(now.getTime() - lastRefill.getTime()) / (1000 * 60 * 30)
		);

		if (halfHoursSinceRefill > 0 && stats.hearts < 10) {
			// 5 hearts per 30-minute interval
			const heartsToAdd = halfHoursSinceRefill * 5;
			const newHearts = Math.min(10, stats.hearts + heartsToAdd);
			if (newHearts > stats.hearts) {
				// Persist the regenerated hearts to database
				await db
					.update(userStats)
					.set({
						hearts: newHearts,
						heartsLastRefilled: now
					})
					.where(eq(userStats.userId, locals.user.id));
				currentHearts = newHearts;
				heartsUpdated = true;
			}
		}
	}

	return {
		user: locals.user,
		userLocale: user?.locale || null,
		activeLanguage: activeLanguage ?? {
			code: 'es',
			name: 'Target Language',
			nativeName: 'Target Language',
			flagEmoji: '🇪🇸',
			whisperCode: 'es',
			tutorName: 'AI Tutor',
			tutorGreeting: null
		},
		stats: stats
			? {
					hearts: currentHearts,
					xpTotal: stats.xpTotal,
					currentStreak: stats.currentStreak,
					longestStreak: stats.longestStreak,
					streakFreezes: stats.streakFreezes,
					totalCorrectAnswers: stats.totalCorrectAnswers
				}
			: {
					hearts: 10,
					xpTotal: 0,
					currentStreak: 0,
					longestStreak: 0,
					streakFreezes: 0,
					totalCorrectAnswers: 0
				}
	};
};

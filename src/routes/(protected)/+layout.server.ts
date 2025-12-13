import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { userStats } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		redirect(303, `/login?redirect=${encodeURIComponent(url.pathname)}`);
	}

	// Fetch user stats for gamification display
	const [stats] = await db
		.select()
		.from(userStats)
		.where(eq(userStats.userId, locals.user.id))
		.limit(1);

	// Calculate current hearts (regenerate over time - 1 heart per hour)
	let currentHearts = stats?.hearts ?? 5;
	let heartsUpdated = false;

	if (stats) {
		const now = new Date();
		const lastRefill = new Date(stats.heartsLastRefilled);
		const hoursSinceRefill = Math.floor((now.getTime() - lastRefill.getTime()) / (1000 * 60 * 60));

		if (hoursSinceRefill > 0 && stats.hearts < 5) {
			const newHearts = Math.min(5, stats.hearts + hoursSinceRefill);
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
					hearts: 5,
					xpTotal: 0,
					currentStreak: 0,
					longestStreak: 0,
					streakFreezes: 0,
					totalCorrectAnswers: 0
				}
	};
};

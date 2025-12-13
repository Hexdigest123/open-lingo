import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, userStats, userAchievements, achievements, userLessonProgress } from '$lib/server/db/schema';
import { eq, count } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	// Get full user data
	const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

	// Get user stats
	const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);

	// Get earned achievements
	const earnedAchievements = await db
		.select({
			id: achievements.id,
			name: achievements.name,
			description: achievements.description,
			iconUrl: achievements.iconUrl,
			earnedAt: userAchievements.earnedAt
		})
		.from(userAchievements)
		.innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
		.where(eq(userAchievements.userId, userId));

	// Get all achievements for display
	const allAchievements = await db.select().from(achievements);

	// Count completed lessons
	const [lessonStats] = await db
		.select({ completed: count() })
		.from(userLessonProgress)
		.where(eq(userLessonProgress.userId, userId));

	return {
		profile: {
			id: user.id,
			email: user.email,
			displayName: user.displayName,
			avatarUrl: user.avatarUrl,
			role: user.role,
			createdAt: user.createdAt
		},
		stats: stats || {
			hearts: 5,
			xpTotal: 0,
			currentStreak: 0,
			longestStreak: 0
		},
		lessonsCompleted: lessonStats?.completed || 0,
		earnedAchievements,
		allAchievements
	};
};

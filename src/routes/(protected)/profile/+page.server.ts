import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import {
	users,
	userStats,
	userAchievements,
	achievements,
	userLessonProgress,
	refreshTokens
} from '$lib/server/db/schema';
import { eq, count } from 'drizzle-orm';
import { verifyPassword } from '$lib/server/auth/password';

const REFRESH_COOKIE_NAME = 'refresh_token';

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
			code: achievements.code,
			name: achievements.name,
			description: achievements.description,
			earnedAt: userAchievements.earnedAt
		})
		.from(userAchievements)
		.innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
		.where(eq(userAchievements.userId, userId));

	// Get all achievements for display
	const allAchievements = (await db.select().from(achievements)).map((achievement) => ({
		...achievement,
		iconUrl: `/achievements/${achievement.code}.svg`
	}));

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
			longestStreak: 0,
			level: 1,
			gems: 0,
			perfectLessons: 0
		},
		lessonsCompleted: lessonStats?.completed || 0,
		earnedAchievements: earnedAchievements.map((achievement) => ({
			...achievement,
			iconUrl: `/achievements/${achievement.code}.svg`
		})),
		allAchievements
	};
};

export const actions: Actions = {
	deleteAccount: async ({ request, locals, cookies }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const password = data.get('password')?.toString();

		if (!password) {
			return fail(400, { deleteError: 'errors.passwordRequired' });
		}

		// Get the user's password hash
		const [user] = await db
			.select({ passwordHash: users.passwordHash })
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (!user) {
			return fail(400, { deleteError: 'errors.userNotFound' });
		}

		// Verify the password
		const isValid = await verifyPassword(password, user.passwordHash);
		if (!isValid) {
			return fail(400, { deleteError: 'errors.incorrectPassword' });
		}

		try {
			// Delete related data first (most tables have CASCADE, but be explicit for safety)
			// Delete refresh tokens
			await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));

			// Delete user stats
			await db.delete(userStats).where(eq(userStats.userId, userId));

			// Delete user achievements
			await db.delete(userAchievements).where(eq(userAchievements.userId, userId));

			// Delete lesson progress
			await db.delete(userLessonProgress).where(eq(userLessonProgress.userId, userId));

			// Finally delete the user
			await db.delete(users).where(eq(users.id, userId));

			// Clear cookies
			cookies.delete(REFRESH_COOKIE_NAME, { path: '/' });

			// Redirect to home with deleted message
			redirect(303, '/?deleted=true');
		} catch (error) {
			console.error('Failed to delete account:', error);
			return fail(500, { deleteError: 'errors.deleteFailed' });
		}
	}
};

import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users, userStats, dailyStreaks } from '$lib/server/db/schema';
import { eq, desc, sql, gte, and } from 'drizzle-orm';
import { getFriendIds } from '$lib/server/learning/friend-service';

export const load: PageServerLoad = async ({ locals, url }) => {
	const userId = locals.user!.id;
	const friendIds = await getFriendIds(userId);
	const timeframe = (url.searchParams.get('timeframe') || 'all_time') as
		| 'daily'
		| 'weekly'
		| 'monthly'
		| 'all_time';

	let leaderboardData: Array<{
		id: number;
		displayName: string;
		xp: number;
		streak: number | null;
		level: number | null;
	}>;

	if (timeframe === 'all_time') {
		// All-time leaderboard based on total XP
		leaderboardData = await db
			.select({
				id: users.id,
				displayName: users.displayName,
				xp: userStats.xpTotal,
				streak: userStats.currentStreak,
				level: userStats.level
			})
			.from(userStats)
			.innerJoin(users, eq(userStats.userId, users.id))
			.orderBy(desc(userStats.xpTotal))
			.limit(50);
	} else {
		// Time-based leaderboard from daily_streaks
		let startDate: Date;
		const now = new Date();

		if (timeframe === 'daily') {
			startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		} else if (timeframe === 'weekly') {
			const dayOfWeek = now.getDay();
			startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
		} else {
			// monthly
			startDate = new Date(now.getFullYear(), now.getMonth(), 1);
		}

		leaderboardData = await db
			.select({
				id: users.id,
				displayName: users.displayName,
				xp: sql<number>`COALESCE(SUM(${dailyStreaks.xpEarned}), 0)`.as('xp'),
				streak: userStats.currentStreak,
				level: userStats.level
			})
			.from(users)
			.leftJoin(userStats, eq(users.id, userStats.userId))
			.leftJoin(
				dailyStreaks,
				and(eq(users.id, dailyStreaks.userId), gte(dailyStreaks.activityDate, startDate))
			)
			.groupBy(users.id, users.displayName, userStats.currentStreak, userStats.level)
			.orderBy(desc(sql`COALESCE(SUM(${dailyStreaks.xpEarned}), 0)`))
			.limit(50);
	}

	// Find current user's rank
	const userRank = leaderboardData.findIndex((entry) => entry.id === userId) + 1;

	// If user not in top 50, get their data separately
	let currentUserData = leaderboardData.find((entry) => entry.id === userId);
	if (!currentUserData) {
		const [userData] = await db
			.select({
				id: users.id,
				displayName: users.displayName,
				xp: userStats.xpTotal,
				streak: userStats.currentStreak,
				level: userStats.level
			})
			.from(userStats)
			.innerJoin(users, eq(userStats.userId, users.id))
			.where(eq(users.id, userId))
			.limit(1);
		currentUserData = userData;
	}

	return {
		leaderboard: leaderboardData.map((entry, index) => ({
			...entry,
			rank: index + 1,
			isCurrentUser: entry.id === userId
		})),
		currentUser: {
			...currentUserData,
			rank: userRank || '50+'
		},
		timeframe,
		friendIds
	};
};

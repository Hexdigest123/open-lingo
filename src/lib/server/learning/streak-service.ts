import { db } from '$lib/server/db';
import { dailyStreaks, userStats, type UserStats } from '$lib/server/db/schema';
import { and, eq, sql } from 'drizzle-orm';

type StatsLike = Pick<
	UserStats,
	| 'currentStreak'
	| 'longestStreak'
	| 'lastActivity'
	| 'streakFreezes'
	| 'freezesEarnedTotal'
	| 'xpTotal'
	| 'totalCorrectAnswers'
>;

function daysSinceActivity(stats: StatsLike | null): number | null {
	if (!stats?.lastActivity) return null;

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const last = new Date(stats.lastActivity);
	last.setHours(0, 0, 0, 0);

	return Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
}

export function computeEffectiveStreak(stats: StatsLike | null): number {
	const gap = daysSinceActivity(stats);
	if (gap === null) return 0;
	if (gap <= 1) return stats!.currentStreak;
	if (gap === 2 && stats!.streakFreezes > 0) return stats!.currentStreak;
	return 0;
}

export const STREAK_MILESTONES = [7, 30, 50, 100, 365] as const;

export interface RecordActivityResult {
	newStreak: number;
	xpGain: number;
	streakFreezeUsed: boolean;
	freezeEarned: boolean;
	firstCorrectToday: boolean;
	streakMilestone: number | null;
	previousLevel: number;
	newLevel: number;
}

export async function recordCorrectAnswer(
	userId: number,
	stats: StatsLike | null,
	awardXp: boolean,
	comboMultiplier: number = 1
): Promise<RecordActivityResult> {
	const baseXp = awardXp ? 10 : 0;
	const xpGain = baseXp * comboMultiplier;
	const newCorrectTotal = awardXp
		? (stats?.totalCorrectAnswers || 0) + 1
		: stats?.totalCorrectAnswers || 0;
	const freezesFromAnswers = Math.floor(newCorrectTotal / 50);
	const currentFreezes = stats?.freezesEarnedTotal || 0;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	let newStreak = stats?.currentStreak || 0;
	let newFreezes = stats?.streakFreezes || 0;
	let streakFreezeUsed = false;
	let freezeEarned = false;

	const gap = daysSinceActivity(stats);

	if (gap === null) {
		newStreak = 1;
	} else if (gap === 0) {
		if (newStreak === 0) newStreak = 1;
	} else if (gap === 1) {
		newStreak = (stats?.currentStreak || 0) + 1;
	} else if (gap === 2) {
		if ((stats?.streakFreezes || 0) > 0) {
			newFreezes = (stats?.streakFreezes || 0) - 1;
			streakFreezeUsed = true;
			newStreak = (stats?.currentStreak || 0) + 1;
		} else {
			newStreak = 1;
		}
	} else {
		newStreak = 1;
	}

	if (freezesFromAnswers > currentFreezes) {
		freezeEarned = true;
		newFreezes = newFreezes + 1;
	}

	await db
		.update(userStats)
		.set({
			xpTotal: (stats?.xpTotal || 0) + xpGain,
			totalCorrectAnswers: newCorrectTotal,
			currentStreak: newStreak,
			longestStreak: Math.max(stats?.longestStreak || 0, newStreak),
			streakFreezes: freezeEarned
				? newFreezes
				: streakFreezeUsed
					? newFreezes
					: stats?.streakFreezes || 0,
			freezesEarnedTotal: freezeEarned ? freezesFromAnswers : stats?.freezesEarnedTotal || 0,
			lastActivity: new Date()
		})
		.where(eq(userStats.userId, userId));

	let firstCorrectToday = false;
	if (awardXp) {
		const [todayStreak] = await db
			.select({ xpEarned: dailyStreaks.xpEarned })
			.from(dailyStreaks)
			.where(and(eq(dailyStreaks.userId, userId), eq(dailyStreaks.activityDate, today)))
			.limit(1);
		firstCorrectToday = !todayStreak || todayStreak.xpEarned === 0;
	}

	await db
		.insert(dailyStreaks)
		.values({ userId, activityDate: today, xpEarned: xpGain })
		.onConflictDoUpdate({
			target: [dailyStreaks.userId, dailyStreaks.activityDate],
			set: { xpEarned: sql`${dailyStreaks.xpEarned} + ${xpGain}` }
		});

	const previousXp = stats?.xpTotal || 0;
	const newXp = previousXp + xpGain;
	const previousLevel = Math.max(1, Math.floor(previousXp / 100) + 1);
	const newLevel = Math.max(1, Math.floor(newXp / 100) + 1);

	if (newLevel !== previousLevel) {
		await db.update(userStats).set({ level: newLevel }).where(eq(userStats.userId, userId));
	}

	const streakMilestone =
		STREAK_MILESTONES.find((m) => newStreak === m && (stats?.currentStreak || 0) < m) ?? null;

	return {
		newStreak,
		xpGain,
		streakFreezeUsed,
		freezeEarned,
		firstCorrectToday,
		streakMilestone,
		previousLevel,
		newLevel
	};
}

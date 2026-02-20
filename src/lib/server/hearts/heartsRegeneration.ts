import type { userStats } from '$lib/server/db/schema';

export function getHeartsWithRegeneration(stats?: typeof userStats.$inferSelect): {
	hearts: number;
	regenerated: boolean;
} {
	let hearts = stats?.hearts ?? 10;
	let regenerated = false;

	if (stats?.heartsLastRefilled) {
		const halfHoursSinceRefill =
			(Date.now() - new Date(stats.heartsLastRefilled).getTime()) / (1000 * 60 * 30);
		const intervals = Math.floor(halfHoursSinceRefill);
		if (intervals > 0) {
			const heartsToAdd = intervals * 5;
			const updatedHearts = Math.min(10, hearts + heartsToAdd);
			regenerated = updatedHearts > hearts;
			hearts = updatedHearts;
		}
	}

	return { hearts, regenerated };
}

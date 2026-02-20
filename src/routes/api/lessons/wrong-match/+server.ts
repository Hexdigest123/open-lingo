import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userStats } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { isHeartsEnabledForUser } from '$lib/server/hearts/heartsEnabled';

// POST: Deduct a heart for a wrong match in matching questions
export const POST: RequestHandler = async ({ locals }) => {
	const userId = locals.user?.id;

	if (!userId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Check if hearts are enabled for this user
	const heartsEnabled = await isHeartsEnabledForUser(userId);
	if (!heartsEnabled) {
		return json({ success: true, hearts: null });
	}

	// Get current stats
	const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);

	if (!stats) {
		return json({ error: 'User stats not found' }, { status: 404 });
	}

	const currentHearts = stats.hearts ?? 0;

	if (currentHearts <= 0) {
		return json({ success: true, hearts: 0 });
	}

	const newHearts = Math.max(0, currentHearts - 1);

	// Update hearts in database
	await db
		.update(userStats)
		.set({
			hearts: newHearts,
			heartsLastRefilled: newHearts < currentHearts ? new Date() : stats.heartsLastRefilled
		})
		.where(eq(userStats.userId, userId));

	return json({ success: true, hearts: newHearts });
};

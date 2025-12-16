import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { isHeartsDisabledGlobal } from '$lib/server/settings/appSettings';

/**
 * Check if hearts are enabled for a specific user.
 * Hearts are disabled if:
 * 1. Global setting is disabled, OR
 * 2. User-specific setting is disabled
 *
 * @param userId The user ID to check
 * @returns true if hearts should be deducted/enforced, false if disabled
 */
export async function isHeartsEnabledForUser(userId: number): Promise<boolean> {
	// Check global setting first
	const globalDisabled = await isHeartsDisabledGlobal();
	if (globalDisabled) {
		return false;
	}

	// Check user-specific override
	const [user] = await db
		.select({ heartsDisabled: users.heartsDisabled })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	return !user?.heartsDisabled;
}

/**
 * Toggle hearts disabled status for a user
 */
export async function setUserHeartsDisabled(userId: number, disabled: boolean): Promise<void> {
	await db
		.update(users)
		.set({ heartsDisabled: disabled, updatedAt: new Date() })
		.where(eq(users.id, userId));
}

/**
 * Get hearts disabled status for a user
 */
export async function isUserHeartsDisabled(userId: number): Promise<boolean> {
	const [user] = await db
		.select({ heartsDisabled: users.heartsDisabled })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	return user?.heartsDisabled ?? false;
}

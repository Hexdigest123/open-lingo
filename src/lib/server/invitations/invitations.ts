import { db } from '$lib/server/db';
import { invitations, users } from '$lib/server/db/schema';
import { eq, and, isNull, gt, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export interface InvitationWithCreator {
	id: number;
	email: string | null;
	code: string;
	usedAt: Date | null;
	usedByUserId: number | null;
	createdById: number;
	createdAt: Date;
	expiresAt: Date;
	createdByName: string;
	usedByName: string | null;
}

/**
 * Generate a unique invitation code
 */
export function generateInvitationCode(): string {
	return randomUUID().replace(/-/g, '');
}

/**
 * Create a new invitation
 * @param email Optional email to restrict the invitation to
 * @param createdById The admin user ID creating the invitation
 * @param expiresInDays Number of days until the invitation expires
 */
export async function createInvitation(
	email: string | null,
	createdById: number,
	expiresInDays: number = 7
): Promise<{ code: string; id: number }> {
	const code = generateInvitationCode();
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + expiresInDays);

	const [invitation] = await db
		.insert(invitations)
		.values({
			email: email?.toLowerCase().trim() || null,
			code,
			createdById,
			expiresAt
		})
		.returning({ id: invitations.id });

	return { code, id: invitation.id };
}

/**
 * Validate an invitation code
 * @returns Validation result with invitation details if valid
 */
export async function validateInvitationCode(
	code: string,
	email?: string
): Promise<{
	valid: boolean;
	invitation?: typeof invitations.$inferSelect;
	error?: string;
}> {
	const [invitation] = await db
		.select()
		.from(invitations)
		.where(eq(invitations.code, code))
		.limit(1);

	if (!invitation) {
		return { valid: false, error: 'Invalid invitation code' };
	}

	if (invitation.usedAt) {
		return { valid: false, error: 'This invitation has already been used' };
	}

	if (new Date() > invitation.expiresAt) {
		return { valid: false, error: 'This invitation has expired' };
	}

	// If the invitation is email-specific, check that it matches
	if (invitation.email && email) {
		if (invitation.email.toLowerCase() !== email.toLowerCase()) {
			return { valid: false, error: 'This invitation is for a different email address' };
		}
	}

	return { valid: true, invitation };
}

/**
 * Mark an invitation as used
 */
export async function markInvitationUsed(code: string, userId: number): Promise<void> {
	await db
		.update(invitations)
		.set({
			usedAt: new Date(),
			usedByUserId: userId
		})
		.where(eq(invitations.code, code));
}

/**
 * Get all invitations with creator info
 */
export async function getInvitations(options?: {
	includeUsed?: boolean;
}): Promise<InvitationWithCreator[]> {
	const conditions = [];

	if (!options?.includeUsed) {
		conditions.push(isNull(invitations.usedAt));
		conditions.push(gt(invitations.expiresAt, new Date()));
	}

	const results = await db
		.select({
			id: invitations.id,
			email: invitations.email,
			code: invitations.code,
			usedAt: invitations.usedAt,
			usedByUserId: invitations.usedByUserId,
			createdById: invitations.createdById,
			createdAt: invitations.createdAt,
			expiresAt: invitations.expiresAt
		})
		.from(invitations)
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(desc(invitations.createdAt));

	// Get creator and used-by names
	const userIds = new Set<number>();
	for (const inv of results) {
		userIds.add(inv.createdById);
		if (inv.usedByUserId) userIds.add(inv.usedByUserId);
	}

	const usersList = await db
		.select({ id: users.id, displayName: users.displayName })
		.from(users)
		.where(
			userIds.size > 0
				? eq(users.id, [...userIds][0]) // This is a workaround - should use inArray
				: undefined
		);

	// Create a more complete user lookup
	const allUsers = await db.select({ id: users.id, displayName: users.displayName }).from(users);
	const userMap = new Map(allUsers.map((u) => [u.id, u.displayName]));

	return results.map((inv) => ({
		...inv,
		createdByName: userMap.get(inv.createdById) || 'Unknown',
		usedByName: inv.usedByUserId ? userMap.get(inv.usedByUserId) || null : null
	}));
}

/**
 * Delete an invitation
 */
export async function deleteInvitation(id: number): Promise<void> {
	await db.delete(invitations).where(eq(invitations.id, id));
}

/**
 * Get invitation by code (for display purposes)
 */
export async function getInvitationByCode(
	code: string
): Promise<typeof invitations.$inferSelect | null> {
	const [invitation] = await db.select().from(invitations).where(eq(invitations.code, code)).limit(1);
	return invitation || null;
}

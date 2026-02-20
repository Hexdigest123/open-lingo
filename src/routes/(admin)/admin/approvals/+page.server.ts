import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSignupMode } from '$lib/server/settings/appSettings';
import {
	sendApprovalNotificationEmail,
	sendRejectionNotificationEmail,
	isEmailConfigured
} from '$lib/server/email/mailer';

export const load: PageServerLoad = async () => {
	// Get all users with pending approval status
	const pendingUsers = await db
		.select({
			id: users.id,
			email: users.email,
			displayName: users.displayName,
			createdAt: users.createdAt
		})
		.from(users)
		.where(eq(users.approvalStatus, 'pending'))
		.orderBy(users.createdAt);

	// Get all users with rejected approval status
	const rejectedUsers = await db
		.select({
			id: users.id,
			email: users.email,
			displayName: users.displayName,
			createdAt: users.createdAt,
			updatedAt: users.updatedAt
		})
		.from(users)
		.where(eq(users.approvalStatus, 'rejected'))
		.orderBy(desc(users.updatedAt));

	const signupMode = await getSignupMode();

	return {
		pendingUsers,
		rejectedUsers,
		signupMode
	};
};

export const actions: Actions = {
	approveUser: async ({ request }) => {
		const data = await request.formData();
		const userId = parseInt(data.get('userId')?.toString() || '0');

		if (!userId) {
			return fail(400, { error: 'Invalid user ID' });
		}

		try {
			// Get user info before updating
			const [user] = await db
				.select({ email: users.email, displayName: users.displayName })
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			await db
				.update(users)
				.set({
					approvalStatus: 'approved',
					updatedAt: new Date()
				})
				.where(eq(users.id, userId));

			// Send approval email notification
			let emailSent = false;
			if (user && isEmailConfigured()) {
				emailSent = await sendApprovalNotificationEmail(user.email, user.displayName);
			}

			const message = emailSent
				? 'User approved and notification email sent'
				: 'User approved successfully';

			return { success: true, message };
		} catch (error) {
			console.error('Failed to approve user:', error);
			return fail(500, { error: 'Failed to approve user' });
		}
	},

	rejectUser: async ({ request }) => {
		const data = await request.formData();
		const userId = parseInt(data.get('userId')?.toString() || '0');

		if (!userId) {
			return fail(400, { error: 'Invalid user ID' });
		}

		try {
			// Get user info before updating
			const [user] = await db
				.select({ email: users.email, displayName: users.displayName })
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			await db
				.update(users)
				.set({
					approvalStatus: 'rejected',
					updatedAt: new Date()
				})
				.where(eq(users.id, userId));

			// Send rejection email notification
			let emailSent = false;
			if (user && isEmailConfigured()) {
				emailSent = await sendRejectionNotificationEmail(user.email, user.displayName);
			}

			const message = emailSent ? 'User rejected and notification email sent' : 'User rejected';

			return { success: true, message };
		} catch (error) {
			console.error('Failed to reject user:', error);
			return fail(500, { error: 'Failed to reject user' });
		}
	},

	reApproveUser: async ({ request }) => {
		const data = await request.formData();
		const userId = parseInt(data.get('userId')?.toString() || '0');

		if (!userId) {
			return fail(400, { error: 'Invalid user ID' });
		}

		try {
			// Get user info before updating
			const [user] = await db
				.select({ email: users.email, displayName: users.displayName })
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			await db
				.update(users)
				.set({
					approvalStatus: 'approved',
					updatedAt: new Date()
				})
				.where(eq(users.id, userId));

			// Send approval email notification
			let emailSent = false;
			if (user && isEmailConfigured()) {
				emailSent = await sendApprovalNotificationEmail(user.email, user.displayName);
			}

			const message = emailSent
				? 'User re-approved and notification email sent'
				: 'User re-approved successfully';

			return { success: true, message };
		} catch (error) {
			console.error('Failed to re-approve user:', error);
			return fail(500, { error: 'Failed to re-approve user' });
		}
	},

	deleteRejectedUser: async ({ request }) => {
		const data = await request.formData();
		const userId = parseInt(data.get('userId')?.toString() || '0');

		if (!userId) {
			return fail(400, { error: 'Invalid user ID' });
		}

		try {
			// Verify the user is actually rejected before deleting
			const [user] = await db
				.select({ approvalStatus: users.approvalStatus })
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);

			if (!user) {
				return fail(404, { error: 'User not found' });
			}

			if (user.approvalStatus !== 'rejected') {
				return fail(400, { error: 'Can only delete rejected users from this page' });
			}

			await db.delete(users).where(eq(users.id, userId));

			return { success: true, message: 'User permanently deleted' };
		} catch (error) {
			console.error('Failed to delete user:', error);
			return fail(500, { error: 'Failed to delete user' });
		}
	}
};

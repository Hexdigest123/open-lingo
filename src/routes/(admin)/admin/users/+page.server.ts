import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, userStats } from '$lib/server/db/schema';
import { eq, ilike, or, desc } from 'drizzle-orm';
import {
	createInvitation,
	getInvitations,
	deleteInvitation
} from '$lib/server/invitations/invitations';
import { getSignupMode } from '$lib/server/settings/appSettings';
import {
	sendInvitationEmail,
	sendApprovalNotificationEmail,
	sendRejectionNotificationEmail,
	isEmailConfigured
} from '$lib/server/email/mailer';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') || '';
	const tab = url.searchParams.get('tab') || 'users';

	const baseQuery = db
		.select({
			id: users.id,
			email: users.email,
			displayName: users.displayName,
			role: users.role,
			heartsDisabled: users.heartsDisabled,
			approvalStatus: users.approvalStatus,
			createdAt: users.createdAt,
			updatedAt: users.updatedAt,
			xpTotal: userStats.xpTotal,
			currentStreak: userStats.currentStreak,
			hearts: userStats.hearts
		})
		.from(users)
		.leftJoin(userStats, eq(users.id, userStats.userId));

	const userList = search
		? await baseQuery
				.where(or(ilike(users.email, `%${search}%`), ilike(users.displayName, `%${search}%`)))
				.orderBy(desc(users.createdAt))
				.limit(100)
		: await baseQuery.orderBy(desc(users.createdAt)).limit(100);

	// Get invitations data
	const invitations = await getInvitations({ includeUsed: true });

	// Get pending approval users
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

	// Get rejected users
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
		users: userList,
		search,
		tab,
		invitations,
		pendingUsers,
		rejectedUsers,
		signupMode,
		emailConfigured: isEmailConfigured()
	};
};

export const actions: Actions = {
	changeRole: async ({ request, locals }) => {
		const data = await request.formData();
		const userId = parseInt(data.get('userId')?.toString() || '0');
		const newRole = data.get('newRole')?.toString() as 'user' | 'admin';

		if (!userId || !newRole) {
			return fail(400, { error: 'User ID and role are required' });
		}

		// Prevent changing own role
		if (userId === locals.user?.id) {
			return fail(400, { error: 'Cannot change your own role' });
		}

		try {
			await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
			return { success: true };
		} catch (error) {
			console.error('Failed to change role:', error);
			return fail(500, { error: 'Failed to change user role' });
		}
	},

	deleteUser: async ({ request, locals }) => {
		const data = await request.formData();
		const userId = parseInt(data.get('userId')?.toString() || '0');

		if (!userId) {
			return fail(400, { error: 'User ID is required' });
		}

		// Prevent deleting self
		if (userId === locals.user?.id) {
			return fail(400, { error: 'Cannot delete your own account' });
		}

		try {
			await db.delete(users).where(eq(users.id, userId));
			return { success: true };
		} catch (error) {
			console.error('Failed to delete user:', error);
			return fail(500, { error: 'Failed to delete user' });
		}
	},

	restoreHearts: async ({ request }) => {
		const data = await request.formData();
		const userId = parseInt(data.get('userId')?.toString() || '0');

		if (!userId) {
			return fail(400, { error: 'User ID is required' });
		}

		try {
			await db
				.update(userStats)
				.set({
					hearts: 10,
					heartsLastRefilled: new Date()
				})
				.where(eq(userStats.userId, userId));
			return { success: true };
		} catch (error) {
			console.error('Failed to restore hearts:', error);
			return fail(500, { error: 'Failed to restore hearts' });
		}
	},

	toggleUserHearts: async ({ request }) => {
		const data = await request.formData();
		const userId = parseInt(data.get('userId')?.toString() || '0');
		const disabled = data.get('disabled')?.toString() === 'true';

		if (!userId) {
			return fail(400, { error: 'User ID is required' });
		}

		try {
			await db
				.update(users)
				.set({
					heartsDisabled: disabled,
					updatedAt: new Date()
				})
				.where(eq(users.id, userId));
			return { success: true };
		} catch (error) {
			console.error('Failed to toggle user hearts:', error);
			return fail(500, { error: 'Failed to toggle hearts for user' });
		}
	},

	// Invitation actions
	createInvitation: async ({ request, locals }) => {
		const adminId = locals.user!.id;
		const data = await request.formData();
		const email = data.get('email')?.toString().trim() || null;
		const expiresInDays = parseInt(data.get('expiresInDays')?.toString() || '7');
		const sendEmail = data.get('sendEmail') === 'true';

		if (expiresInDays < 1 || expiresInDays > 365) {
			return fail(400, { error: 'Expiry days must be between 1 and 365' });
		}

		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, { error: 'Invalid email format' });
		}

		try {
			const invitation = await createInvitation(email, adminId, expiresInDays);

			let emailSent = false;
			if (sendEmail && email && isEmailConfigured()) {
				const [admin] = await db
					.select({ displayName: users.displayName })
					.from(users)
					.where(eq(users.id, adminId))
					.limit(1);

				emailSent = await sendInvitationEmail(email, invitation.code, admin?.displayName);
			}

			const message = emailSent
				? 'Invitation created and email sent successfully'
				: 'Invitation created successfully';

			return { success: true, message, code: invitation.code, emailSent };
		} catch (error) {
			console.error('Failed to create invitation:', error);
			return fail(500, { error: 'Failed to create invitation' });
		}
	},

	deleteInvitation: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id')?.toString() || '0');

		if (!id) {
			return fail(400, { error: 'Invalid invitation ID' });
		}

		try {
			await deleteInvitation(id);
			return { success: true, message: 'Invitation deleted' };
		} catch (error) {
			console.error('Failed to delete invitation:', error);
			return fail(500, { error: 'Failed to delete invitation' });
		}
	},

	// Approval actions
	approveUser: async ({ request }) => {
		const data = await request.formData();
		const userId = parseInt(data.get('userId')?.toString() || '0');

		if (!userId) {
			return fail(400, { error: 'Invalid user ID' });
		}

		try {
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

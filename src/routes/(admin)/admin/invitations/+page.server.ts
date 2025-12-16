import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import {
	createInvitation,
	getInvitations,
	deleteInvitation
} from '$lib/server/invitations/invitations';
import { getSignupMode } from '$lib/server/settings/appSettings';
import { sendInvitationEmail, isEmailConfigured } from '$lib/server/email/mailer';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	const [invitations, signupMode] = await Promise.all([
		getInvitations({ includeUsed: true }),
		getSignupMode()
	]);

	return {
		invitations,
		signupMode,
		emailConfigured: isEmailConfigured(),
		baseUrl: '' // Will be populated client-side
	};
};

export const actions: Actions = {
	createInvitation: async ({ request, locals }) => {
		const adminId = locals.user!.id;
		const data = await request.formData();
		const email = data.get('email')?.toString().trim() || null;
		const expiresInDays = parseInt(data.get('expiresInDays')?.toString() || '7');
		const sendEmail = data.get('sendEmail') === 'true';

		if (expiresInDays < 1 || expiresInDays > 365) {
			return fail(400, { error: 'Expiry days must be between 1 and 365' });
		}

		// Validate email format if provided
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, { error: 'Invalid email format' });
		}

		try {
			const invitation = await createInvitation(email, adminId, expiresInDays);

			// Send email if requested and email is provided
			let emailSent = false;
			if (sendEmail && email && isEmailConfigured()) {
				// Get admin's display name
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
	}
};

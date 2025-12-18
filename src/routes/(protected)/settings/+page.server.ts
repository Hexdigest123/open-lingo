import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, hashPassword } from '$lib/server/auth/password';

export const load: PageServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const [user] = await db
		.select({
			id: users.id,
			email: users.email,
			displayName: users.displayName
		})
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	return {
		profile: user
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const displayName = data.get('displayName')?.toString().trim();

		if (!displayName) {
			return fail(400, { profileError: 'Display name is required' });
		}

		if (displayName.length < 2 || displayName.length > 50) {
			return fail(400, { profileError: 'Display name must be between 2 and 50 characters' });
		}

		try {
			await db
				.update(users)
				.set({
					displayName,
					updatedAt: new Date()
				})
				.where(eq(users.id, userId));

			return { profileSuccess: true };
		} catch (error) {
			console.error('Failed to update profile:', error);
			return fail(500, { profileError: 'Failed to update profile' });
		}
	},

	changePassword: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const currentPassword = data.get('currentPassword')?.toString();
		const newPassword = data.get('newPassword')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();

		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { passwordError: 'All password fields are required' });
		}

		if (newPassword.length < 8) {
			return fail(400, { passwordError: 'New password must be at least 8 characters' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { passwordError: 'New passwords do not match' });
		}

		// Get current password hash
		const [user] = await db
			.select({ passwordHash: users.passwordHash })
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (!user) {
			return fail(400, { passwordError: 'User not found' });
		}

		// Verify current password
		const isValid = await verifyPassword(currentPassword, user.passwordHash);
		if (!isValid) {
			return fail(400, { passwordError: 'Current password is incorrect' });
		}

		try {
			const newHash = await hashPassword(newPassword);
			await db
				.update(users)
				.set({
					passwordHash: newHash,
					updatedAt: new Date()
				})
				.where(eq(users.id, userId));

			return { passwordSuccess: true };
		} catch (error) {
			console.error('Failed to change password:', error);
			return fail(500, { passwordError: 'Failed to change password' });
		}
	}
};

import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, hashPassword } from '$lib/server/auth/password';
import { isValidInputWithSpaces, isValidInput, MAX_INPUT_LENGTH } from '$lib/server/validation/input';

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
			return fail(400, { profileError: 'errors.displayNameRequired' });
		}

		if (displayName.length < 2 || displayName.length > 50) {
			return fail(400, { profileError: 'errors.displayNameLength' });
		}

		if (!isValidInputWithSpaces(displayName)) {
			return fail(400, { profileError: 'errors.invalidCharacters' });
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

	updateLocale: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const locale = data.get('locale')?.toString();

		if (!locale || (locale !== 'en' && locale !== 'de')) {
			return fail(400, { localeError: 'Invalid locale' });
		}

		try {
			await db
				.update(users)
				.set({
					locale,
					updatedAt: new Date()
				})
				.where(eq(users.id, userId));

			return { localeSuccess: true };
		} catch (error) {
			console.error('Failed to update locale:', error);
			return fail(500, { localeError: 'Failed to update locale' });
		}
	},

	changePassword: async ({ request, locals }) => {
		const userId = locals.user!.id;
		const data = await request.formData();
		const currentPassword = data.get('currentPassword')?.toString();
		const newPassword = data.get('newPassword')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();

		if (!currentPassword) {
			return fail(400, { passwordError: 'errors.currentPasswordRequired' });
		}

		if (!newPassword) {
			return fail(400, { passwordError: 'errors.newPasswordRequired' });
		}

		if (!confirmPassword) {
			return fail(400, { passwordError: 'errors.confirmPasswordRequired' });
		}

		if (!isValidInput(newPassword)) {
			return fail(400, { passwordError: 'errors.invalidCharacters' });
		}

		if (newPassword.length < 8) {
			return fail(400, { passwordError: 'errors.passwordMinLength' });
		}

		if (newPassword.length > MAX_INPUT_LENGTH) {
			return fail(400, { passwordError: 'errors.passwordMaxLength' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { passwordError: 'auth.errors.passwordMismatch' });
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
			return fail(400, { passwordError: 'errors.currentPasswordIncorrect' });
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

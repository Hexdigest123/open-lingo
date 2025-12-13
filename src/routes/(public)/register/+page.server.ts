import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { createUserWithSession } from '$lib/server/auth/session';

const REFRESH_COOKIE_NAME = 'refresh_token';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const displayName = data.get('displayName')?.toString().trim();
		const email = data.get('email')?.toString().toLowerCase().trim();
		const password = data.get('password')?.toString();
		const confirmPassword = data.get('confirmPassword')?.toString();

		// Validation
		if (!displayName || !email || !password || !confirmPassword) {
			return fail(400, { error: 'All fields are required', displayName, email });
		}

		if (displayName.length < 2 || displayName.length > 50) {
			return fail(400, { error: 'Display name must be between 2 and 50 characters', displayName, email });
		}

		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters', displayName, email });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match', displayName, email });
		}

		// Check if email already exists
		const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

		if (existingUser) {
			return fail(400, { error: 'An account with this email already exists', displayName, email });
		}

		try {
			// Create user and session
			const { tokens } = await createUserWithSession(email, password, displayName);

			// Set refresh token cookie
			cookies.set(REFRESH_COOKIE_NAME, tokens.refreshToken, {
				path: '/',
				httpOnly: true,
				secure: !import.meta.env.DEV,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			// Redirect to dashboard
			redirect(303, '/dashboard');
		} catch (error) {
			console.error('Registration error:', error);
			return fail(500, { error: 'Something went wrong. Please try again.', displayName, email });
		}
	}
};

import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '$lib/server/auth/password';
import { createSession } from '$lib/server/auth/session';

const REFRESH_COOKIE_NAME = 'refresh_token';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().toLowerCase().trim();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		// Find user by email
		const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

		if (!user) {
			return fail(400, { error: 'Invalid email or password', email });
		}

		// Verify password
		const isValid = await verifyPassword(password, user.passwordHash);

		if (!isValid) {
			return fail(400, { error: 'Invalid email or password', email });
		}

		// Create session
		const tokens = await createSession(user.id, user.email, user.role);

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
	}
};

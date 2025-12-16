import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '$lib/server/auth/password';
import { createSession } from '$lib/server/auth/session';

const REFRESH_COOKIE_NAME = 'refresh_token';

/**
 * Validate redirect URL to prevent open redirects
 * Only allows relative paths within the same origin
 */
function isValidRedirect(redirectUrl: string | null): string | null {
	if (!redirectUrl) return null;

	// Must start with / (relative path)
	if (!redirectUrl.startsWith('/')) return null;

	// Must not start with // (protocol-relative URL)
	if (redirectUrl.startsWith('//')) return null;

	// Must not contain protocol indicator
	if (redirectUrl.includes(':')) return null;

	// Basic path validation - only allow alphanumeric, /, -, _, and query strings
	if (!/^\/[a-zA-Z0-9\-_\/]*(\?[a-zA-Z0-9\-_=&%]*)?$/.test(redirectUrl)) return null;

	return redirectUrl;
}

export const load: PageServerLoad = async ({ url }) => {
	const redirectParam = url.searchParams.get('redirect');
	const validatedRedirect = isValidRedirect(redirectParam);

	return {
		redirect: validatedRedirect
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().toLowerCase().trim();
		const password = data.get('password')?.toString();
		const redirectParam = data.get('redirect')?.toString() || url.searchParams.get('redirect');
		const validatedRedirect = isValidRedirect(redirectParam);

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

		// Check if user is rejected
		if (user.approvalStatus === 'rejected') {
			redirect(303, '/rejected');
		}

		// Check if user is pending approval
		if (user.approvalStatus === 'pending') {
			// Create session so they can access the pending page
			const tokens = await createSession(user.id, user.email, user.role);
			cookies.set(REFRESH_COOKIE_NAME, tokens.refreshToken, {
				path: '/',
				httpOnly: true,
				secure: !import.meta.env.DEV,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});
			redirect(303, '/pending-approval');
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

		// Redirect to requested page or dashboard
		redirect(303, validatedRedirect || '/dashboard');
	}
};
